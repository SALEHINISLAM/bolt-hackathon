"use client"
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function Page() {
  const params=useSearchParams()
  console.log(params.get('coachId'));
  return (
    <div>Please mail us to book: msionlinekingdom@gmail.com</div>
  )
}
