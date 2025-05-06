const PDFDocument = require("pdfkit");

function generatePDFReceipt(user, purchase) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on("data", (data) => buffers.push(data));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.fontSize(25).text("Policy Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Name: ${user.firstName} ${user.lastName}`);
      doc.text(`Phone: ${user.mobile}`);
      doc.text(`Address: ${user.address}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Coverage Amount: ${user.coverageAmount}`);
      doc.text(`Tenure: ${user.tenure}`);
      doc.text(`Premium: ${user.premium}`);
      doc.moveDown();
      doc.text("Your Purchase was succesfull");
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePDFReceipt };
