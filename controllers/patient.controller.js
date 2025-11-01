const prisma = require("../db");

const getAllPatients = async () => {
  try {
    let patients = await prisma.patient.findMany();
    return { success: true, data: patients };
  } catch (error) {
    return { success: false, error: "Failed to fetch patients" };
  }
};

const getPatientById = async (id) => {
  try {
    let patient = await prisma.patient.findUnique({
      where: { id },
      include: { visits: true }, // Include patient's visits
    });
    
    if (!patient) {
      return { success: false, error: "Patient not found" };
    }
    
    return { success: true, data: patient };
  } catch (error) {
    return { success: false, error: "Failed to fetch patient" };
  }
};

const insertPatient = async (formData) => {
  try {
    if (!formData.name) {
      return { success: false, error: "Patient name is required" };
    }
    
    let patient = await prisma.patient.create({
      data: formData,
    });
    
    return { 
      success: true, 
      message: "Patient added successfully",
      patient: patient 
    };
  } catch (error) {
    if (error.code === 'P2002') {
      return { success: false, error: "Phone number already exists" };
    }
    return { success: false, error: "Failed to add patient" };
  }
};

const deletePatient = async (id) => {
  try {
    let patient = await prisma.patient.findUnique({
      where: { id },
    });
    
    if (!patient) {
      return { success: false, error: "Patient not found" };
    }
    
    await prisma.patient.delete({
      where: { id },
    });
    
    return { 
      success: true, 
      message: "Patient deleted successfully",
      patient: patient 
    };
  } catch (error) {
    return { success: false, error: "Failed to delete patient" };
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  insertPatient,
  deletePatient,
};
