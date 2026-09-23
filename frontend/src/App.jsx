import SlotPicker from './pages/SlotPicker.jsx'

const mockSlots = {
  GENERAL: [
    { id: 1, slot_date: '2569-10-01', start_time: '09:00', remaining: 4 },
    { id: 2, slot_date: '2569-10-01', start_time: '10:00', remaining: 2 },
  ],
  EXECUTIVE: [
    { id: 3, slot_date: '2569-10-02', start_time: '09:30', remaining: 1 },
  ],
}

// API จำลองสำหรับ FR-BKG-01 และ FR-BKG-06
function fetchMockSlots(packageCode) {
  return Promise.resolve(mockSlots[packageCode] ?? [])
}

export default function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 border-l-4 border-teal-600 pl-4">
          <h1 className="text-2xl font-bold text-slate-900">ระบบจองคิวตรวจสุขภาพ</h1>
          <p className="mt-1 text-slate-600">เลือกแพ็กเกจและช่วงเวลาที่สะดวก</p>
        </header>
        <SlotPicker fetchSlots={fetchMockSlots} />
      </div>
    </main>
  )
}
