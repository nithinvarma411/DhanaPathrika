package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nithinvarma411/CAPSTONE/GOserver/models"
	"github.com/xuri/excelize/v2"
	"gopkg.in/gomail.v2"
)

func HandleExportStock(c *gin.Context) {
	var req models.EmailRequest
	if err := c.BindJSON(&req); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// fmt.Printf("Received request - Email: %s, Stock items: %d\n", req.Email, len(req.Stock))

	if len(req.Stock) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No stock items provided"})
		return
	}

	// Create Excel file
	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Printf("Error closing excel file: %v\n", err)
		}
	}()

	// Use the default sheet
	sheetName := "Sheet1"

	// Set headers with style
	headerStyle, err := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 12},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#C6EFCE"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center"},
	})
	if err != nil {
		fmt.Printf("Error creating header style: %v\n", err)
	}

	headers := []string{"Item Name", "Cost Price", "Selling Price", "Available Quantity", "Min Quantity", "Item Code", "Group", "Unit"}
	for i, header := range headers {
		col, _ := excelize.ColumnNumberToName(i + 1)
		cell := col + "1"
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}

	// Add data
	for i, item := range req.Stock {
		row := i + 2                                           // Start from row 2
		fmt.Printf("Writing item to row %d: %+v\n", row, item) // Debug log

		// Write each field and handle potential type conversions
		cells := []interface{}{
			item.ItemName,
			item.CostPrice,
			item.SellingPrice,
			item.AvailableQuantity,
			item.MinQuantity,
			item.ItemCode,
			item.Group,
			item.Unit,
		}

		for j, value := range cells {
			col, _ := excelize.ColumnNumberToName(j + 1)
			cell := fmt.Sprintf("%s%d", col, row)
			f.SetCellValue(sheetName, cell, value)
		}
	}

	// Auto-fit columns
	for i := 0; i < len(headers); i++ {
		col, _ := excelize.ColumnNumberToName(i + 1)
		f.SetColWidth(sheetName, col, col, 15)
	}

	// Save to temp file
	tempDir := "temp"
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		fmt.Printf("Error creating temp directory: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create temp directory"})
		return
	}

	timestamp := time.Now().Format("20060102150405")
	filename := fmt.Sprintf("stock_export_%s.xlsx", timestamp)
	filepath := filepath.Join(tempDir, filename)

	if err := f.SaveAs(filepath); err != nil {
		fmt.Printf("Error saving excel file: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save Excel file"})
		return
	}

	// Send email
	m := gomail.NewMessage()
	m.SetHeader("From", os.Getenv("EMAIL_FROM"))
	m.SetHeader("To", req.Email)
	m.SetHeader("Subject", "Stock Export")
	m.SetBody("text/plain", "Please find attached your stock export.")
	m.Attach(filepath)

	d := gomail.NewDialer("smtp.gmail.com", 587, os.Getenv("EMAIL_FROM"), os.Getenv("EMAIL_PASSWORD"))
	if err := d.DialAndSend(m); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}

	// Clean up
	os.Remove(filepath)

	c.JSON(http.StatusOK, gin.H{"message": "Stock exported and sent successfully"})
}
