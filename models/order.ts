import mongoose, { Schema, Document, models } from "mongoose";

export interface IOrder extends Document {
  customerName?: string;
  customerPhone?: string;
  // This allows for both Inventory-linked items and Custom/Manual items
  items: {
    productId?: mongoose.Types.ObjectId; // Optional: Only if it's a shop product
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  isCustomSale: boolean; // True if it's a manual entry without inventory
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, trim: true },
    customerPhone: { type: String, trim: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" }, // Optional
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    isCustomSale: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model<IOrder>("Order", orderSchema);
export default Order;