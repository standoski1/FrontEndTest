"use client"
import React, { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'


export default function withAuth(Component:any) {
    
  return function WithAuth(props:any) {
    const [token, seTtoken] = useState("")
    useEffect(() => {
      const storedData = localStorage.getItem("auth-storage");
      // @ts-ignore
      const parsedData = JSON.parse(storedData); 
      seTtoken(parsedData?.state?.token) 
      if (!parsedData?.state?.token) {
        redirect("/login")
      }
    }, [])
    if (!token) {
        return null
    }
    return <Component {...props}/>
  }
}
