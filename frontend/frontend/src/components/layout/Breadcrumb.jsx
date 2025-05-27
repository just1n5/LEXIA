import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

function Breadcrumb({ items, className = '' }) {
  return (
    <div className={cn('breadcrumb', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link to={item.href} className="breadcrumb-link">
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
          
          {index < items.length - 1 && (
            <span className="breadcrumb-separator">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
