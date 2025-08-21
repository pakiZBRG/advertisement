import mongoose from "mongoose";

const charLimit = {
  small: 200,
  medium: 300,
  big: 400,
};

const advertisementSchema = new mongoose.Schema(
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
      required: [true, "Advertisement description is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

advertisementSchema.pre("validate", function (next) {
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

  if (this.phoneNumber.length < 12) {
    this.invalidate("phoneNumber", "Phone number is not valid");
  }

  next();
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

export default Advertisement;
