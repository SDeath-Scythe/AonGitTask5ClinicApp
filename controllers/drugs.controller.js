const prisma = require("../db");

const getAllDrugs = async () => {
  try {
    let drugs = await prisma.drugs.findMany();
    return { success: true, data: drugs };
  } catch (error) {
    return { success: false, error: "Failed to fetch drugs" };
  }
};

const getDrugsById = async (id) => {
  try {
    let drug = await prisma.drugs.findUnique({
      where: { id },
    });
    
    if (!drug) {
      return { success: false, error: "Drug not found" };
    }
    
    return { success: true, data: drug };
  } catch (error) {
    return { success: false, error: "Failed to fetch drug" };
  }
};

const insertDrug = async (formData) => {
  try {
    if (!formData.name) {
      return { success: false, error: "Drug name is required" };
    }
    
    let drug = await prisma.drugs.create({
      data: formData,
    });
    
    return { 
      success: true, 
      message: "Drug added successfully",
      drug: drug 
    };
  } catch (error) {
    if (error.code === 'P2002') {
      return { success: false, error: "Drug name already exists" };
    }
    return { success: false, error: "Failed to add drug" };
  }
};

const updateDrug = async (id, formData) => {
  try {
    let drug = await prisma.drugs.findUnique({
      where: { id },
    });
    
    if (!drug) {
      return { success: false, error: "Drug not found" };
    }
    
    let updatedDrug = await prisma.drugs.update({
      where: { id },
      data: formData,
    });
    
    return { 
      success: true, 
      message: "Drug updated successfully",
      drug: updatedDrug 
    };
  } catch (error) {
    if (error.code === 'P2002') {
      return { success: false, error: "Drug name already exists" };
    }
    return { success: false, error: "Failed to update drug" };
  }
};

const deleteDrug = async (id) => {
  try {
    let drug = await prisma.drugs.findUnique({
      where: { id },
    });
    
    if (!drug) {
      return { success: false, error: "Drug not found" };
    }
    
    await prisma.drugs.delete({
      where: { id },
    });
    
    return { 
      success: true, 
      message: "Drug deleted successfully",
      drug: drug 
    };
  } catch (error) {
    return { success: false, error: "Failed to delete drug" };
  }
};

module.exports = {
  getAllDrugs,
  getDrugsById,
  insertDrug,
  updateDrug,
  deleteDrug,
};
