import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Room, RoomRequest, Complaint, Payment } from '../types';

interface State {
  users: User[];
  rooms: Room[];
  roomRequests: RoomRequest[];
  complaints: Complaint[];
  payments: Payment[];
  currentUser: User | null;
  theme: 'light' | 'dark';
  
  // Auth actions
  login: (username: string, password: string) => User | null;
  logout: () => void;
  registerStudent: (userData: Omit<User, 'id' | 'role'>) => void;
  
  // Room actions
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;
  
  // Request actions
  createRoomRequest: (request: Omit<RoomRequest, 'id' | 'timestamp' | 'status'>) => void;
  updateRoomRequest: (requestId: string, status: 'approved' | 'rejected') => void;
  
  // Complaint actions
  createComplaint: (complaint: Omit<Complaint, 'id' | 'timestamp' | 'status'>) => void;
  updateComplaintStatus: (complaintId: string, status: Complaint['status']) => void;
  
  // Payment actions
  createPayment: (payment: Omit<Payment, 'id' | 'timestamp'>) => void;
  
  // Theme action
  toggleTheme: () => void;
}

const useStore = create<State>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: '1',
          username: 'admin',
          password: '123456',
          email: 'admin@hostel.com',
          role: 'admin'
        }
      ],
      rooms: [],
      roomRequests: [],
      complaints: [],
      payments: [],
      currentUser: null,
      theme: 'light',

      login: (username, password) => {
        const user = get().users.find(
          u => u.username === username && u.password === password
        );
        if (user) {
          set({ currentUser: user });
          return user;
        }
        return null;
      },

      logout: () => set({ currentUser: null }),

      registerStudent: (userData) => {
        const newUser: User = {
          ...userData,
          id: crypto.randomUUID(),
          role: 'student'
        };
        set(state => ({ users: [...state.users, newUser] }));
      },

      addRoom: (roomData) => {
        const newRoom: Room = {
          ...roomData,
          id: crypto.randomUUID()
        };
        set(state => ({ rooms: [...state.rooms, newRoom] }));
      },

      updateRoom: (room) => {
        set(state => ({
          rooms: state.rooms.map(r => r.id === room.id ? room : r)
        }));
      },

      deleteRoom: (roomId) => {
        set(state => ({
          rooms: state.rooms.filter(r => r.id !== roomId)
        }));
      },

      createRoomRequest: (requestData) => {
        const newRequest: RoomRequest = {
          ...requestData,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          status: 'pending'
        };
        set(state => ({
          roomRequests: [...state.roomRequests, newRequest]
        }));
      },

      updateRoomRequest: (requestId, status) => {
        set(state => ({
          roomRequests: state.roomRequests.map(req =>
            req.id === requestId ? { ...req, status } : req
          )
        }));
      },

      createComplaint: (complaintData) => {
        const newComplaint: Complaint = {
          ...complaintData,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          status: 'open'
        };
        set(state => ({
          complaints: [...state.complaints, newComplaint]
        }));
      },

      updateComplaintStatus: (complaintId, status) => {
        set(state => ({
          complaints: state.complaints.map(complaint =>
            complaint.id === complaintId ? { ...complaint, status } : complaint
          )
        }));
      },

      createPayment: (paymentData) => {
        const newPayment: Payment = {
          ...paymentData,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        };
        set(state => ({
          payments: [...state.payments, newPayment]
        }));
      },

      toggleTheme: () => {
        set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        }));
      }
    }),
    {
      name: 'hostel-storage'
    }
  )
);

export default useStore;