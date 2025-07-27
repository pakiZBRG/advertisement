import mongoose from "mongoose";

const charLimit = {
  small: 200,
  medium: 300,
  big: 400,
};

const advertismentSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    price: {
      type: String,
      enum: ["small", "medium", "big"],
      default: "small",
    },
    description: {
      type: String,
      required: [true, "Advertisment description is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

advertismentSchema.pre("validate", function (next) {
  const price = this.price || "small";
  const desc = this.description || "";
  const limit = charLimit[price];

  if (desc.length > limit) {
    this.invalidate(
      "description",
      `Description exceeds maximum length of ${limit} characters for a "${price}" advert.`,
      desc
    );
  }

  next();
});

const Advertisment = mongoose.model("Advertisment", advertismentSchema);

export default Advertisment;
