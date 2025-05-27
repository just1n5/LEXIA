import React from 'react'
import { cn } from '../../utils/cn'

function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-3',
  }

  return (
    <div className={cn('loading-spinner', sizeClasses[size], className)} />
  )
}

function TableSkeleton({ rows = 5 }) {
  return (
    <div className="table-skeleton">
      {/* Header skeleton */}
      <div className="skeleton-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-search" />
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-row">
          <div className="skeleton skeleton-cell" />
          <div className="skeleton skeleton-cell" />
          <div className="skeleton skeleton-cell" />
          <div className="skeleton skeleton-cell" />
          <div className="skeleton skeleton-cell" />
          <div className="skeleton skeleton-cell" />
        </div>
      ))}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton h-4 w-24 mb-2" />
      <div className="skeleton h-8 w-16" />
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="form-card">
      <div className="skeleton h-6 w-32 mb-4" />
      <div className="skeleton h-10 w-full mb-4" />
      <div className="skeleton h-10 w-full mb-4" />
      <div className="skeleton h-10 w-32" />
    </div>
  )
}

LoadingSpinner.TableSkeleton = TableSkeleton
LoadingSpinner.CardSkeleton = CardSkeleton
LoadingSpinner.FormSkeleton = FormSkeleton

export default LoadingSpinner
