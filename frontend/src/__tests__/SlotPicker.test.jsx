import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import SlotPicker from '../pages/SlotPicker.jsx'

describe('SlotPicker', () => {
  it('แสดงช่วงเวลาและที่นั่งคงเหลือจาก API จำลอง', async () => {
    const fetchSlots = vi.fn().mockResolvedValue([
      { id: 1, slot_date: '2569-10-01', start_time: '09:00', remaining: 3 },
    ])

    render(<SlotPicker fetchSlots={fetchSlots} />)

    expect(await screen.findByText('09:00 น.')).toBeTruthy()
    expect(screen.getByText('เหลือ 3 ที่นั่ง')).toBeTruthy()
    expect(fetchSlots).toHaveBeenCalledWith('GENERAL')
  })

  it('โหลดช่วงเวลาใหม่เมื่อเปลี่ยนแพ็กเกจ', async () => {
    const fetchSlots = vi.fn().mockImplementation((packageCode) =>
      Promise.resolve(
        packageCode === 'GENERAL'
          ? [{ id: 1, slot_date: '2569-10-01', start_time: '09:00', remaining: 3 }]
          : [{ id: 2, slot_date: '2569-10-02', start_time: '13:00', remaining: 1 }],
      ),
    )

    render(<SlotPicker fetchSlots={fetchSlots} />)
    await screen.findByText('09:00 น.')

    fireEvent.change(screen.getByLabelText('แพ็กเกจตรวจสุขภาพ'), { target: { value: 'EXECUTIVE' } })

    await waitFor(() => expect(screen.getByText('13:00 น.')).toBeTruthy())
    expect(fetchSlots).toHaveBeenLastCalledWith('EXECUTIVE')
  })
})