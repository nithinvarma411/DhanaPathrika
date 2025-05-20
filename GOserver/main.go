package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/nithinvarma411/CAPSTONE/GOserver/config"
	"github.com/nithinvarma411/CAPSTONE/GOserver/routes"
)

func main() {
	// Only load .env locally (skip on Render)
	if os.Getenv("RENDER") == "" {
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found (this is fine in production)")
		}
	}

	config.ConnectDB()

	r := gin.Default()

	// Configure CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{os.Getenv("ORIGIN")}
	corsConfig.AllowCredentials = true
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type"}
	r.Use(cors.New(corsConfig))

	// Setup routes
	routes.SetupRoutes(r)

	// Use PORT from env (Render sets this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // fallback for local dev
	}

	r.Run(":" + port)
}
