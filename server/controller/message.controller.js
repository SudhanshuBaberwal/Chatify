export const sendMessage = async (req , res) => {
    try {
        
    } catch (error) {
        console.log("Error in sendMessage Function : ", error)
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}