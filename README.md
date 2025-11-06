# ⭐ Review Service

Service quản lý đánh giá (reviews) cho hệ thống Dorm Booking System. Service này xử lý CRUD operations cho reviews và ratings.

## 🚀 Tính năng

### **Review Management**
- ✅ Tạo review mới
- ✅ Lấy danh sách reviews
- ✅ Lấy review theo ID
- ✅ Cập nhật review
- ✅ Xóa review
- ✅ Lấy reviews theo room
- ✅ Lấy reviews theo user
- ✅ Tính toán rating trung bình

### **Features**
- ✅ Rating system (1-5 stars)
- ✅ Comment/review text
- ✅ Review validation
- ✅ Lọc và phân trang

## 📁 Cấu trúc thư mục

```
src/
├── modules/
│   └── reviews/         # Review module
│       ├── dto/        # Data Transfer Objects
│       ├── reviews.controller.ts
│       ├── reviews.service.ts
│       └── reviews.module.ts
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── prisma.service.ts
└── main.ts
```

## ⚙️ Cấu hình

### **Environment Variables**

Tạo file `.env` trong thư mục root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/review_db"

# Application
PORT=3006
NODE_ENV=development
```

## 🚀 Cài đặt và chạy

### **Yêu cầu**
- Node.js 18+
- PostgreSQL

### **Cài đặt**

```bash
# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn

# Chạy database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### **Chạy development**

```bash
npm run start:dev
```

### **Build và chạy production**

```bash
# Build
npm run build

# Chạy production
npm run start:prod
```

## 📡 API Endpoints

### **Review Management**

#### `POST /reviews`
Tạo review mới

**Request Body:**
```json
{
  "userId": "user-uuid",
  "roomId": "room-uuid",
  "rating": 5,
  "comment": "Great room, very clean and comfortable!"
}
```

**Response:**
```json
{
  "id": "review-uuid",
  "userId": "user-uuid",
  "roomId": "room-uuid",
  "rating": 5,
  "comment": "Great room, very clean and comfortable!",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

#### `GET /reviews`
Lấy danh sách reviews (với phân trang và lọc)

**Query Parameters:**
- `page`: Số trang (default: 1)
- `limit`: Số items mỗi trang (default: 10)
- `roomId`: Lọc theo room ID
- `userId`: Lọc theo user ID
- `minRating`: Rating tối thiểu
- `maxRating`: Rating tối đa

**Example:**
```
GET /reviews?page=1&limit=10&roomId=room-uuid&minRating=4
```

#### `GET /reviews/:id`
Lấy review theo ID

#### `PATCH /reviews/:id`
Cập nhật review

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

#### `DELETE /reviews/:id`
Xóa review

#### `GET /reviews/room/:roomId`
Lấy reviews theo room ID

#### `GET /reviews/user/:userId`
Lấy reviews theo user ID

#### `GET /reviews/room/:roomId/average-rating`
Lấy rating trung bình của room

**Response:**
```json
{
  "roomId": "room-uuid",
  "averageRating": 4.5,
  "totalReviews": 10,
  "ratingDistribution": {
    "5": 5,
    "4": 3,
    "3": 1,
    "2": 1,
    "1": 0
  }
}
```

## 📝 Database Schema

Service sử dụng Prisma ORM. Xem file `prisma/schema.prisma` để biết chi tiết schema.

### **Main Models:**
- `Review` - Thông tin review

### **Rating Scale:**
- `1` - Rất tệ
- `2` - Tệ
- `3` - Bình thường
- `4` - Tốt
- `5` - Rất tốt

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐳 Docker

```bash
# Build image
docker build -t review-service .

# Run với docker-compose
docker-compose up
```

## 🔒 Security

- Input validation với class-validator
- SQL injection protection (Prisma)
- Rating validation (1-5)
- User authorization (chỉ user tạo review mới có thể sửa/xóa)

## 📝 Notes

- Service có thể mở rộng để tích hợp với Kafka/RabbitMQ
- Rating được validate trong khoảng 1-5
- Mỗi user chỉ có thể review một room một lần (có thể cập nhật)

## 📄 License

MIT
