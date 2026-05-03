import axios from "axios";
import { prisma } from "../../../config/prisma";

/**
 * ১. পেমেন্ট লিঙ্ক জেনারেট করা (Purchase Idea)
 */
export const purchaseIdea = async (userId: string, ideaId: string) => {
  // আইডিয়া খুঁজে বের করা
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  if (!idea) throw new Error("Idea not found!");
  
  // চেক করুন প্রাইজ ০ কি না বা পেইড কি না
  if (!idea.isPaid || !idea.price || idea.price <= 0) {
    throw new Error("This idea is either free or price is not set correctly!");
  }

  const transactionId = `PUR-${Date.now()}`;

  // ডাটাবেসে পেমেন্ট রেকর্ড PENDING হিসেবে তৈরি
  await prisma.payment.create({
    data: {
      transactionId,
      amount: idea.price,
      userId,
      ideaId,
      status: "PENDING",
    },
  });

  // SSLCommerz এর জন্য প্যারামিটার সেট করা
  const params = new URLSearchParams();
  params.append("store_id", process.env.STORE_ID || "");
  params.append("store_passwd", process.env.STORE_PASSWORD || "");
  params.append("total_amount", idea.price.toString());
  params.append("currency", "BDT");
  params.append("tran_id", transactionId);
  params.append("success_url", `http://localhost:5000/api/v1/payments/success/${transactionId}`);
  params.append("fail_url", `http://localhost:5000/api/v1/payments/fail/${transactionId}`);
  params.append("cancel_url", `http://localhost:5000/api/v1/payments/fail/${transactionId}`);
  params.append("cus_name", "Customer Name");
  params.append("cus_email", "customer@mail.com");
  params.append("cus_phone", "01700000000");
  params.append("cus_add1", "Dhaka");
  params.append("cus_country", "Bangladesh");
  params.append("shipping_method", "NO");
  params.append("product_name", idea.title.slice(0, 30)); 
  params.append("product_category", "Digital");
  params.append("product_profile", "general");

  try {
    const response = await axios.post(process.env.SSL_PAYMENT_URL!, params);

    if (response.data?.status === "SUCCESS") {
      return response.data.GatewayPageURL; 
    } else {
      console.log("SSL Failure Reason:", response.data?.failedreason);
      return response.data?.failedreason || "Failed to generate payment URL";
    }
  } catch (error: any) {
    console.error("Axios Error:", error.message);
    throw new Error("Could not connect to SSLCommerz. Check your .env URL.");
  }
};

/**
 * ২. পেমেন্ট স্ট্যাটাস আপডেট করা (Fulfill Payment)
 */
export const fulfillPayment = async (transactionId: string) => {
  return await prisma.payment.update({
    where: { transactionId },
    data: { status: "PAID" },
  });
};

/**
 * ৩. ইউজার এক্সেস চেক করা (Check Access)
 */
export const checkAccess = async (userId: string, ideaId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      ideaId,
      status: "PAID",
    },
  });

  // পেমেন্ট রেকর্ড পাওয়া গেলে true, নাহলে false
  return !!payment;
};