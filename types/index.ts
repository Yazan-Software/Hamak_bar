export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Stylist {
  id: string
  name: string
  bio: string | null
  avatar_url: string | null
  specialties: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ServiceCategory = 'haircut' | 'beard' | 'color' | 'treatment' | 'kids'

export interface Service {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number
  deposit_amount: number
  category: ServiceCategory
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AvailabilityRule {
  id: string
  stylist_id: string
  day_of_week: number
  start_time: string
  end_time: string
  buffer_minutes: number
  created_at: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'

export interface Booking {
  id: string
  user_id: string | null
  service_id: string
  stylist_id: string | null
  start_time: string
  end_time: string
  status: BookingStatus
  payment_status: PaymentStatus
  total_price: number
  deposit_amount: number
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
  service?: Service
  stylist?: Stylist
}

export interface Review {
  id: string
  user_id: string
  booking_id: string | null
  stylist_id: string | null
  rating: number
  comment: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  profile?: Profile
  stylist?: Stylist
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock_quantity: number
  image_url: string | null
  category: string | null
  stripe_price_id: string | null
  stripe_product_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  booking_id: string | null
  stripe_payment_intent_id: string
  stripe_session_id: string | null
  amount: number
  currency: string
  status: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingWizardState {
  step: number
  service: Service | null
  stylist: Stylist | null
  date: Date | null
  timeSlot: string | null
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
}

export interface DashboardStats {
  totalBookings: number
  todayBookings: number
  totalRevenue: number
  pendingBookings: number
}
