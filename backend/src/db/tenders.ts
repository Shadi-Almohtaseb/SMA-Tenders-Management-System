import mongoose from "mongoose";

export enum TenderStatus {
  UNDER_STUDY = "UNDER_STUDY",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED"
}

const tenderSchema = new mongoose.Schema({
  owningEntity: { type: String, required: true },
  openingDate: { type: Date, required: true },
  fundingEntity: { type: String, required: true },
  guaranteeAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(TenderStatus),
    required: true
  },
  participatingCompany: { type: String, required: true },
  biddingCompany: { type: String, required: true },
  guaranteeExpiryDate: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const TenderModel = mongoose.model("Tender", tenderSchema);

/* DB helpers – same style as users.ts */
export const getTenders = () => TenderModel.find();
export const getTenderById = (id: string) => TenderModel.findById(id);
export const createTender = (data: any) =>
  new TenderModel(data).save().then(t => t.toObject());
export const updateTenderById = (id: string, data: any) =>
  TenderModel.findByIdAndUpdate(id, data, { new: true });
export const deleteTenderById = (id: string) =>
  TenderModel.findByIdAndDelete(id);

export const getTendersPaginated = (
  page: number,
  pageSize: number
) => {
  const skip = (page - 1) * pageSize;

  return TenderModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);
};

export const getTendersCount = () => TenderModel.countDocuments();

