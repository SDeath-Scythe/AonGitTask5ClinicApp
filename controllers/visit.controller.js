const prisma = require("../db");

const getAllVisits = async () => {
  try {
    let visits = await prisma.visit.findMany({
      include: { patient: true }, // Include patient info
    });
    return { success: true, data: visits };
  } catch (error) {
    return { success: false, error: "Failed to fetch visits" };
  }
};

const getVisitById = async (id) => {
  try {
    let visit = await prisma.visit.findUnique({
      where: { id },
      include: { patient: true }, // Include patient info
    });
    
    if (!visit) {
      return { success: false, error: "Visit not found" };
    }
    
    return { success: true, data: visit };
  } catch (error) {
    return { success: false, error: "Failed to fetch visit" };
  }
};

const insertVisit = async (formData) => {
  try {
    // Validate required fields
    if (!formData.patientId) {
      return { success: false, error: "Patient ID is required" };
    }
    if (!formData.totalPrice) {
      return { success: false, error: "Total price is required" };
    }

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: formData.patientId },
    });
    
    if (!patient) {
      return { success: false, error: "Patient not found with this ID" };
    }

    let visit = await prisma.visit.create({
      data: formData,
      include: { patient: true },
    });
    
    return { 
      success: true, 
      message: "Visit added successfully",
      visit: visit 
    };
  } catch (error) {
    return { success: false, error: "Failed to add visit" };
  }
};

const updateVisit = async (id, formData) => {
  try {
    let visit = await prisma.visit.findUnique({
      where: { id },
    });
    
    if (!visit) {
      return { success: false, error: "Visit not found" };
    }
    
    // If patientId is being updated, check if new patient exists
    if (formData.patientId && formData.patientId !== visit.patientId) {
      const patient = await prisma.patient.findUnique({
        where: { id: formData.patientId },
      });
      
      if (!patient) {
        return { success: false, error: "Patient not found with this ID" };
      }
    }
    
    let updatedVisit = await prisma.visit.update({
      where: { id },
      data: formData,
      include: { patient: true },
    });
    
    return { 
      success: true, 
      message: "Visit updated successfully",
      visit: updatedVisit 
    };
  } catch (error) {
    return { success: false, error: "Failed to update visit" };
  }
};

const deleteVisit = async (id) => {
  try {
    let visit = await prisma.visit.findUnique({
      where: { id },
      include: { patient: true },
    });
    
    if (!visit) {
      return { success: false, error: "Visit not found" };
    }
    
    await prisma.visit.delete({
      where: { id },
    });
    
    return { 
      success: true, 
      message: "Visit deleted successfully",
      visit: visit 
    };
  } catch (error) {
    return { success: false, error: "Failed to delete visit" };
  }
};

module.exports = {
  getAllVisits,
  getVisitById,
  insertVisit,
  updateVisit,
  deleteVisit,
};
