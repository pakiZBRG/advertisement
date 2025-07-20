import mongoose from "mongoose";

const charLimit = {
  small: 300,
  medium: 400,
  big: 500,
};

const advertismentSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Advertisment description is required"],
      validate: {
        validator: function (desc) {
          const price = this.price || "small"; // fallback if not set
          const length = desc.length;

          return length <= charLimit[price];
        },
        message: function () {
          const price = this.price || "small";
          return `Description exceeds maximum length of ${charLimit[price]} characters for a "${price}" advert.`;
        },
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    price: {
      type: String,
      enum: ["small", "medium", "big"],
      default: "small",
    },
  },
  { timestamps: true }
);

const Advertisments = mongoose.model("Advertisment", advertismentSchema);

export default Advertisments;
