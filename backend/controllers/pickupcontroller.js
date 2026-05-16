const Pickup = require("../models/pickup");
const { sendMail } = require("../utils/mailer");
const User = require("../models/user");
const { isDemoMode, demoPickups } = require("../utils/demoMode");

// 📌 Create Pickup
exports.createPickup = async (req, res) => {
  try {
    if (isDemoMode()) {
      const pickup = {
        _id: `demo-pickup-${Date.now()}`,
        ...req.body,
        status: "Pending",
        createdBy: { _id: req.user._id, name: req.user.name, email: req.user.email },
        createdAt: new Date().toISOString(),
      };
      return res.status(201).json({ message: "Pickup created successfully ✅", pickup });
    }

    const { temple, address, wasteType, scheduleDate, contactNumber, quantity } =
      req.body;

    let errors = [];

    // Validation
    if (!temple) errors.push("Temple required");
    if (!address) errors.push("Address required");
    if (!wasteType) errors.push("Waste type required");
    if (!contactNumber) errors.push("Contact number required");
    if (!quantity) errors.push("Quantity required");

    const pickupDate = new Date(scheduleDate);
    if (!scheduleDate || isNaN(pickupDate.getTime())) {
      errors.push("Valid date required");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Create Pickup
    const pickup = await Pickup.create({
      temple,
      address,
      wasteType,
      scheduleDate: pickupDate,
      contactNumber,
      quantity,
      status: "Pending",
      createdBy: req.user._id
    });

    // ✅ Email after successful create (inside async function)
    try {
      await sendMail({
        to: req.user.email,
        subject: "Pickup Request Created ✅",
        text: `Your pickup request has been created.\nTemple: ${pickup.temple}\nStatus: ${pickup.status}\nDate: ${pickup.scheduleDate.toDateString()}`
      });
    } catch (mailErr) {
      console.log("Email failed (pickup create):", mailErr.message);
    }

    return res.status(201).json({
      message: "Pickup created successfully ✅",
      pickup
    });
  } catch (error) {
    console.error("Create Pickup Error:", error);
    return res.status(500).json({
      message: "Server Error ❌",
      error: error.message
    });
  }
};

// 📌 Get My Pickups
exports.getMyPickups = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(demoPickups().filter((pickup) => pickup.createdBy?.email === req.user.email));
    }
    const pickups = await Pickup.find({
      createdBy: req.user._id
    }).sort({ createdAt: -1 });

    return res.json(pickups);
  } catch (error) {
    console.error("Get My Pickups Error:", error);
    return res.status(500).json({ message: "Server Error ❌" });
  }
};

// 📌 Get All Pickups (Admin)
exports.getAllPickups = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json(demoPickups());
    }
    const pickups = await Pickup.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.json(pickups);
  } catch (error) {
    console.error("Get All Pickups Error:", error);
    return res.status(500).json({ message: "Server Error ❌" });
  }
};

// 📌 Update Pickup Status (Admin)
exports.updatePickupStatus = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({
        message: "Pickup status updated ✅",
        pickup: { _id: req.params.id, status: req.body.status || "Pending" },
      });
    }

    const { status, assignedVolunteer, vehicleNumber, estimatedArrival, trackingNote, currentLocation, mapQuery } = req.body;

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found ❌" });
    }

    pickup.status = status || pickup.status;
    if (typeof assignedVolunteer === "string") pickup.assignedVolunteer = assignedVolunteer;
    if (typeof vehicleNumber === "string") pickup.vehicleNumber = vehicleNumber;
    if (typeof estimatedArrival === "string") pickup.estimatedArrival = estimatedArrival;
    if (typeof trackingNote === "string") pickup.trackingNote = trackingNote;
    if (typeof currentLocation === "string") pickup.currentLocation = currentLocation;
    if (typeof mapQuery === "string") pickup.mapQuery = mapQuery;
    await pickup.save();

    // ✅ Email after status update (inside async function)
    try {
      const user = await User.findById(pickup.createdBy).select("email name");
      if (user?.email) {
        await sendMail({
          to: user.email,
          subject: "Pickup Status Updated ✅",
          text: `Hi ${user.name || "User"},\nYour pickup status is now: ${pickup.status}\nTemple: ${pickup.temple}${pickup.estimatedArrival ? `\nETA: ${pickup.estimatedArrival}` : ""}${pickup.vehicleNumber ? `\nVehicle: ${pickup.vehicleNumber}` : ""}${pickup.assignedVolunteer ? `\nAssigned To: ${pickup.assignedVolunteer}` : ""}${pickup.currentLocation ? `\nCurrent Location: ${pickup.currentLocation}` : ""}`
        });
      }
    } catch (mailErr) {
      console.log("Email failed (pickup status):", mailErr.message);
    }

    return res.json({
      message: "Pickup status updated ✅",
      pickup
    });
  } catch (error) {
    console.error("Update Pickup Error:", error);
    return res.status(500).json({ message: "Server Error ❌" });
  }
};

// 📌 Delete Pickup
exports.deletePickup = async (req, res) => {
  try {
    if (isDemoMode()) {
      return res.json({ message: "Pickup deleted successfully ✅" });
    }
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found ❌" });
    }

    if (
      pickup.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized ❌" });
    }

    await pickup.deleteOne();
    return res.json({ message: "Pickup deleted successfully ✅" });
  } catch (error) {
    console.error("Delete Pickup Error:", error);
    return res.status(500).json({ message: "Server Error ❌" });
  }
};