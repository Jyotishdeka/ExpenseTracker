import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.Model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//method for reuse
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing Went Wrong while generating Refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("Incoming Request Body:", req.body);

  //step-1-> get user details from frontend

  const { username, email, password } = req.body;

  //step-2 > validation  - not empty

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fileds are Required");
  }

  //step-3 -> check if user already exists

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User Already Exist");
  }

  //step-4 -> chcek for images

  console.log("Body", req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is Required");
  }

  //step-5 -> upload them to cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  //step-6 -> create user object - create entry in db

  const user = await User.create({
    username: username.toLowerCase(),
    avatar: avatar.url,
    email,
    password,
  });

  //step-7 -> remove password and refresh token from response

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //step-8 -> Check for user creation

  if (!createdUser) {
    throw new ApiError(500, "Something Went Wrong while creating the user");
  }

  //step-9 -> return response

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Created"));
});

const loginUser = asyncHandler(async (req, res) => {
  // step1-> Get user details from req body

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  // step2-> check username or email is exist or not

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User not exist");
  }

  // step-3-> password check

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Cerdentials");
  }

  // step-4-> access amd refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // step-4-> cookie send

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //step-5-> send res
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user Logged In"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"));
});

export { registerUser, loginUser, logoutUser };
