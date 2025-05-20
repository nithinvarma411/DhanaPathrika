package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/nithinvarma411/CAPSTONE/GOserver/controllers"
)

func SetupRoutes(r *gin.Engine) {
    r.POST("/export-stock", controllers.HandleExportStock)
}
