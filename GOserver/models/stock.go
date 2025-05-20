package models

type StockItem struct {
    ItemName          string  `json:"ItemName"`
    CostPrice         float64 `json:"CostPrice"`
    SellingPrice      float64 `json:"SellingPrice"`
    AvailableQuantity int     `json:"AvailableQuantity"`
    MinQuantity       int     `json:"MinQuantity"`
    ItemCode          string  `json:"ItemCode"`
    Group             string  `json:"Group"`
    Unit              string  `json:"Unit"`
}

type EmailRequest struct {
    Email string      `json:"email"`
    Stock []StockItem `json:"stock"`
}
