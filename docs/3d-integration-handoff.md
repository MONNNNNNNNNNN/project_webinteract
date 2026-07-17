# คู่มือเชื่อมงาน 3D Simulation (CDLC) เข้ากับ DME Explorer

> เอกสารนี้ทำขึ้นเพื่อให้ MON (เจ้าของ DME Explorer) และ Thanasoonton (ทำ 3D simulation ห้อง CDLC) ทำงานคู่ขนานกันได้โดยไม่ต้องรอกัน แล้วมาต่อกันตอนท้ายแบบไม่มีปัญหา

## หลักการออกแบบ: แยกงานให้ขาดจากกัน (Decoupled Build)

ไม่ว่า Thanasoonton จะเลือกทำด้วยเครื่องมืออะไร (Unity, Three.js, หรืออื่นๆ) **DME Explorer จะไม่ยุ่งกับโค้ดข้างในของ 3D simulation เลย** — จะรับมันในรูปแบบ "web build สำเร็จรูป" (โฟลเดอร์ที่เปิดด้วย `index.html` แล้วรันได้เอง) มาวางใน `public/cdlc-sim/` แล้วเปิดผ่าน `<iframe>` ในหน้า ThreeDWorld.jsx เท่านั้น

ข้อดีของวิธีนี้:
- Thanasoonton ทำงานในโปรเจกต์/repo ของตัวเองได้อิสระ ไม่ต้อง clone หรือแก้โค้ด React ของ MON เลย
- ไม่มีทางเกิด merge conflict ระหว่างโค้ด React กับโค้ด 3D
- เปลี่ยนเครื่องมือ 3D ทีหลังได้โดยไม่กระทบฝั่งเว็บเลย ตราบใดที่ยังส่งออกมาเป็น web build ได้

## ขั้นตอนที่ 1: เลือกเครื่องมือ (ให้ Thanasoonton ตัดสินใจ)

| เครื่องมือ | ความเร็วในการทำ interactive walkthrough | ความยาก | ขนาดไฟล์หลัง build | เหมาะกับ |
|---|---|---|---|---|
| **Unity → WebGL export** | เร็วที่สุด มี first-person controller สำเร็จรูปให้ใช้เลย | ปานกลาง (ถ้าเคยใช้ Unity มาก่อน จากวิชาที่มีสอนอยู่แล้ว) | ใหญ่ (มักหลาย 10-100+ MB ถ้าไม่บีบอัด) | คนถนัด Unity อยู่แล้ว ต้องการเดินสำรวจห้องแบบเกม |
| **Three.js / React Three Fiber** | ช้ากว่า ต้องเขียน controller เอง | สูงกว่าถ้าไม่เคยเขียน JS/WebGL มาก่อน | เล็กกว่า ควบคุมง่ายกว่า | คนถนัดเขียนโค้ดเว็บ อยากได้ไฟล์เบา โหลดเร็ว |
| **Blender export (.glb) อย่างเดียว ไม่ทำ interactivity เอง** | ไม่ต้องเขียนโค้ดเลย แค่โมเดล | ต่ำสุดสำหรับ Thanasoonton แต่ MON ต้องมาเขียน viewer/walkthrough เพิ่มเอง | เบาที่สุดถ้าบีบอัดด้วย Draco | ถ้า Thanasoonton ถนัดโมเดล 3D มากกว่าเขียนโค้ด |

**คำแนะนำ**: ถ้า Thanasoonton เคยผ่านวิชาที่ใช้ Unity มาก่อน (ตามหลักสูตร DME มักมีสอน) แนะนำ **Unity WebGL** เพราะเร็วสุดสำหรับทำ "การเดินสำรวจ" ได้จริงภายใน 12 สัปดาห์ ถ้าไม่ถนัดโค้ดเลย ให้เลือกทางเลือกที่ 3 (ส่งแค่โมเดล) แล้วแจ้ง MON ล่วงหน้า เพราะฝั่ง MON ต้องเผื่อเวลาทำ viewer เพิ่ม

## ขั้นตอนที่ 2: ข้อกำหนดของ Build ที่ต้องส่งมอบ (Handoff Spec)

ไม่ว่าจะเลือกเครื่องมือไหน สิ่งที่ต้องส่งให้ MON คือ:

1. **โฟลเดอร์ static build ที่รันได้เองโดยไม่ต้องมี server พิเศษ** — เปิด `index.html` ในเบราว์เซอร์แล้วใช้งานได้ทันที (double-click ไฟล์หรือรันผ่าน local static server ทดสอบก่อนส่ง)
2. **ขนาดไฟล์รวมไม่ควรเกิน ~50MB** (ยิ่งเล็กยิ่งดี) — เพราะ Vercel Hobby (free tier) มี bandwidth 100GB/เดือนรวมทั้งเว็บ ถ้าไฟล์ใหญ่มากจะโหลดช้าและกิน quota เร็วตอน demo/มีคนเข้าหลายคน
   - Unity: เปิด compression เป็น Brotli หรือ Gzip ใน Build Settings, ลด texture resolution ถ้าจำเป็น
   - Three.js/glTF: ใช้ Draco compression บีบโมเดล, บีบอัด texture เป็น .webp
3. **มี loading screen ของตัวเอง** ระหว่างโหลด asset (กัน user เห็นจอขาวค้าง)
4. **Controls scheme ที่ชัดเจน** เขียนแจ้ง MON ว่าใช้อะไรควบคุม (WASD? ลากเมาส์? กดจุด waypoint?) จะได้เอาไปใส่ใน demo script และคำแนะนำในหน้าเว็บ
5. **ทดสอบบน Chrome อย่างน้อย** ก่อนส่ง (ตาม non-functional requirement ที่ต้อง support Chrome/Edge/Safari)

## ขั้นตอนที่ 3: วิธีส่งมอบให้ MON

เลือกวิธีใดวิธีหนึ่ง:
- **แนะนำ**: สร้าง branch ชื่อ `cdlc-sim-build` ใน repo ของ DME Explorer แล้ว push เฉพาะโฟลเดอร์ build เข้าไปที่ `public/cdlc-sim/` แล้วเปิด Pull Request ให้ MON review + merge
- หรือส่งไฟล์ zip ผ่าน Drive/LINE แล้ว MON เป็นคน copy เข้า repo เอง (ง่ายกว่าถ้า Thanasoonton ไม่คุ้น git)

## ขั้นตอนที่ 4: MON เอา build เข้าเว็บ (ทำหลังได้รับไฟล์)

```bash
# วางโฟลเดอร์ build ของ Thanasoonton ไว้ตรงนี้
public/cdlc-sim/
├── index.html
└── (ไฟล์อื่นๆ ที่ build ออกมา — .wasm, .data, .js, .glb ฯลฯ)
```

Vite/React จะ serve ทุกอย่างใน `public/` เป็น static file ตรงๆ โดยอัตโนมัติ ไม่ต้อง config เพิ่ม — เข้าถึงได้ที่ `/cdlc-sim/index.html`

โค้ดฝั่ง `src/pages/ThreeDWorld.jsx` (ตัวอย่างโครง ให้ Claude Code เติมรายละเอียด/สไตล์ให้ตรงกับธีมเว็บ):

```jsx
import { useState } from "react";

export default function ThreeDWorld() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-[80vh]">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          กำลังโหลดห้อง CDLC...
        </div>
      )}
      <iframe
        src="/cdlc-sim/index.html"
        title="CDLC 3D Simulation"
        className="w-full h-full border-0"
        onLoad={() => setLoaded(true)}
        allow="fullscreen"
      />
    </div>
  );
}
```

หมายเหตุ: ถ้า Thanasoonton เลือกทางเลือกที่ 3 (ส่งแค่ไฟล์โมเดล .glb ไม่ทำ interactivity) โครงนี้ใช้ไม่ได้ตรงๆ — MON ต้องเขียน viewer เองด้วย `@react-three/fiber` + `@react-three/drei` (มี `<OrbitControls />` สำเร็จรูปให้หมุนดูโมเดลได้ทันที) แจ้งได้ถ้าต้องการโครงโค้ดส่วนนี้เพิ่ม

## ขั้นตอนที่ 5: ทดสอบร่วมกัน

- ทดสอบว่าเข้า/ออก simulation ได้ลื่น (ปุ่ม "กลับสู่ DME Explorer" ทำงานถูกต้อง ไม่มีเสียง/animation ค้างหลังออก)
- ทดสอบขนาดหน้าจอ Desktop และ Tablet ตามที่ non-functional requirement เดิมกำหนดไว้ (จากเอกสาร Studio 4 ที่ใช้อ้างอิง)
- **ใช้เป็นจุดเสี่ยงสูงสุดของ demo** — เตรียมวิดีโอสำรอง (screen record การเดินสำรวจ) ไว้เสมอ เผื่อ WebGL/3D build มีปัญหาเข้ากับ projector หรือ wifi ห้อง present ช้า

## Checklist สรุปสั้นๆ

- [ ] Thanasoonton เลือกเครื่องมือแล้ว
- [ ] ทดสอบ build เปิดจาก `index.html` ได้เองก่อนส่ง
- [ ] ขนาดไฟล์ไม่เกิน ~50MB (บีบอัดแล้ว)
- [ ] แจ้ง controls scheme ให้ MON
- [ ] ส่งผ่าน branch/PR หรือไฟล์ zip
- [ ] MON วางใน `public/cdlc-sim/` + ต่อ iframe ใน `ThreeDWorld.jsx`
- [ ] ทดสอบเข้า-ออก, ทดสอบ Desktop/Tablet
- [ ] อัดวิดีโอสำรองไว้เผื่อ demo สด
