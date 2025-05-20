package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/nithinvarma411/CAPSTONE/GOserver/config"
	"github.com/nithinvarma411/CAPSTONE/GOserver/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading dotenv", err)
	}

	config.ConnectDB()

	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"Origin", "Content-Type"}
	r.Use(cors.New(config))

	// Setup routes
	routes.SetupRoutes(r)

	r.Run(":8080")
}
