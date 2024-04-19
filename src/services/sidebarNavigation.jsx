
import { Navigate } from "react-router-dom"

export const viewProfile = ()=>{
          console.log('view profile clicked')
         return <Navigate to={'/profile'} replace></Navigate>

} 