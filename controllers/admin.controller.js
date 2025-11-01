const prisma = require("../db");
const jwt = require("jsonwebtoken");

const generateOTP = async (phone) => {
        try {
                // Check if admin with this phone exists
                const user = await prisma.admin.findUnique({
                        where: {
                                phone,
                        },
                });

                if (!user) {
                        return { error: "Admin not found with this phone number" };
                }

                // Generate 4-digit OTP
                const otp = Math.floor(1000 + Math.random() * 9000).toString();

                // Update admin with OTP and timestamp
                await prisma.admin.update({
                        where: {
                                phone,
                        },
                        data: {
                                otp: otp,
                                otpCreatedAt: new Date(),
                        },
                });

                // In production, send OTP via SMS instead of returning it
                return { message: "OTP generated successfully", otp };
        } catch (error) {
                console.error("Error generating OTP:", error);
                return { error: "Failed to generate OTP" };
        }
};

const verifyOTP = async (phone, otp) => {
        try {
                // Find admin with matching phone and OTP
                const user = await prisma.admin.findFirst({
                        where: {
                                phone,
                                otp,
                        },
                });

                if (!user) {
                        return { error: "Invalid phone number or OTP" };
                }

                // Check if OTP is still valid (5 minutes expiry)
                const otpAge = new Date() - new Date(user.otpCreatedAt);
                const fiveMinutesInMs = 5 * 60 * 1000;

                if (otpAge > fiveMinutesInMs) {
                        return { error: "OTP has expired. Please request a new one." };
                }

                // Clear OTP and activate admin after successful verification
                await prisma.admin.update({
                        where: {
                                id: user.id,
                        },
                        data: {
                                otp: null,
                                otpCreatedAt: null,
                                active: true,
                        },
                });

                // Generate JWT token
                const token = jwt.sign(
                        { id: user.id, phone: user.phone },
                        process.env.JWT_SECRET,
                        { expiresIn: "30d" }
                );

                return {
                        id: user.id,
                        phone: user.phone,
                        active: true,
                        token,
                };
        } catch (error) {
                console.error("Error verifying OTP:", error);
                return { error: "Failed to verify OTP" };
        }
};

const getAllAdmins = async () => {
        try {
                let admins = await prisma.admin.findMany();
                return { success: true, data: admins };
        } catch (error) {
                return { success: false, error: "Failed to fetch admins" };
        }
};

const getAdminById = async (id) => {
        try {
                let admin = await prisma.admin.findUnique({
                        where: { id },
                });
                
                if (!admin) {
                        return { success: false, error: "Admin not found" };
                }
                
                return { success: true, data: admin };
        } catch (error) {
                return { success: false, error: "Failed to fetch admin" };
        }
};

const insertAdmin = async (formData) => {
        try {
                if (!formData.phone) {
                        return { success: false, error: "Phone number is required" };
                }
                
                let admin = await prisma.admin.create({
                        data: formData,
                });
                
                return { 
                        success: true, 
                        message: "Admin created successfully",
                        admin: admin 
                };
        } catch (error) {
                if (error.code === 'P2002') {
                        return { success: false, error: "Phone number already exists" };
                }
                return { success: false, error: "Failed to create admin" };
        }
};

const deleteAdmin = async (id) => {
        try {
                let admin = await prisma.admin.findUnique({
                        where: { id },
                });
                
                if (!admin) {
                        return { success: false, error: "Admin not found" };
                }
                
                await prisma.admin.delete({
                        where: { id },
                });
                
                return { 
                        success: true, 
                        message: "Admin deleted successfully",
                        admin: admin 
                };
        } catch (error) {
                return { success: false, error: "Failed to delete admin" };
        }
};

module.exports = {
        getAllAdmins,
        getAdminById,
        insertAdmin,
        deleteAdmin,
        generateOTP,
        verifyOTP,
};
