import { useEffect, useState } from 'react'

const packages = [
  { code: 'GENERAL', label: 'ตรวจสุขภาพทั่วไป' },
  { code: 'EXECUTIVE', label: 'ตรวจสุขภาพผู้บริหาร' },
]

// ตัวเลือกแพ็กเกจและช่วงเวลารองรับ FR-BKG-01 และ FR-BKG-06
export default function SlotPicker({ fetchSlots }) {
  const [packageCode, setPackageCode] = useState(packages[0].code)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchSlots(packageCode).then((nextSlots) => {
      if (active) {
        setSlots(nextSlots)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [fetchSlots, packageCode])

  return (
    <section aria-labelledby="slot-picker-title" className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Booking</p>
        <h2 id="slot-picker-title" className="mt-2 text-3xl font-bold text-slate-900">
          เลือกแพ็กเกจและช่วงเวลาตรวจ
        </h2>
        <p className="mt-2 text-slate-600">แสดงช่วงเวลาที่ว่างภายใน 30 วันข้างหน้า</p>
      </div>

      <label className="block max-w-md text-sm font-semibold text-slate-700" htmlFor="package-code">
        แพ็กเกจตรวจสุขภาพ
        <select
          id="package-code"
          className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 font-normal text-slate-900 shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
          value={packageCode}
          onChange={(event) => setPackageCode(event.target.value)}
        >
          {packages.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div aria-live="polite">
        {loading ? (
          <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">กำลังโหลดช่วงเวลา...</p>
        ) : slots.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">ไม่มีช่วงเวลาที่ว่าง</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {slots.map((slot) => (
              <li key={slot.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-semibold text-slate-900">{slot.slot_date}</p>
                <p className="mt-2 text-xl font-bold text-teal-800">{slot.start_time} น.</p>
                <p className="mt-2 text-sm text-slate-600">เหลือ {slot.remaining} ที่นั่ง</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}