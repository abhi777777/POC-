
export const validateForm = (formData) => {
  let errors = {};
  const { firstName, middleName, lastName, email, mobile, additional } =
    formData;

  const nameRegex = /^[A-Za-z]+$/;
  if (!nameRegex.test(firstName))
    errors.firstName = "First Name can't contain numbers";
  if (middleName && !nameRegex.test(middleName))
    errors.middleName = "Middle Name can't contain numbers";
  if (!nameRegex.test(lastName))
    errors.lastName = "Last Name can't contain numbers";

  // Validate email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) errors.email = "Invalid email format";

  // Validate mobile
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) errors.mobile = "Invalid mobile number";

  // Validate PAN (if provided)
  if (additional?.pan) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(additional.pan))
      errors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
  }

  // Validate Aadhar (if provided)
  if (additional?.aadhar) {
    // Remove spaces for validation
    const cleanAadhar = additional.aadhar.replace(/\s/g, "");
    const aadharRegex = /^[0-9]{12}$/;
    if (!aadharRegex.test(cleanAadhar))
      errors.aadhar = "Invalid Aadhar Number (12 digits)";
  }

  // Validate GST (if provided)
  if (additional?.gstNumber) {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!gstRegex.test(additional.gstNumber))
      errors.gstNumber = "Invalid GST Number format";
  }

  // Validate nominees total contribution (should be 100%)
  if (formData.nominees && formData.nominees.length > 0) {
    const totalContribution = formData.nominees.reduce(
      (sum, nominee) => sum + (parseInt(nominee.contribution) || 0),
      0
    );

    if (totalContribution !== 100) {
      errors.nominees = "Total nominee contribution must equal 100%";
    }
  }

  return errors;
};
