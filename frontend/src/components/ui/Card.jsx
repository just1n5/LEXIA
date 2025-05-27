import React from 'react'
import { cn } from '../../utils/cn'

function Card({ children, className = '', ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  )
}

function FormCard({ children, className = '', ...props }) {
  return (
    <div className={cn('form-card', className)} {...props}>
      {children}
    </div>
  )
}

function AuthCard({ children, className = '', ...props }) {
  return (
    <div className={cn('auth-card', className)} {...props}>
      {children}
    </div>
  )
}

Card.Form = FormCard
Card.Auth = AuthCard

export default Card
