/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { PdfService } from '../service/pdf.service';

const pdfService = new PdfService();

export interface ICriteria {
  id: number;
  measurement_standard: string;
  normal_criteria: string;
  abnormal_criteria: string;
  standard_value: string;
  sequence: number;
  result: string | null;
  measured_value: string | null;
  repair_suggestion: string | null;
  file_url: string | null;
}

export interface IItems {
  id: number;
  name: string;
  sequence: number;
  criteria: ICriteria[];
}

export interface ICategories {
  id: number;
  name: string;
  sequence: number;
  items: IItems[];
}

export interface IDataService {
  quotation_no: string;
  customer_name: string;
  car_model_name: string;
  plate: string;
  car_mileage: string;
  car_image: string;
  checkup_date: string;
  inspector_name: string;
  categories: ICategories[];
}

export interface IService {
  success: boolean;
  message: string;
  data: IDataService;
}

export class PdfController {
  async createPdf(req: Request, res: Response) {
    try {
      const { quotationNumber, type } = req.body;

      if (!quotationNumber) {
        // เอา return ออก เปลี่ยนเป็นส่ง res ไปเฉยๆ แล้วสั่งจบการทำงานด้วยการใส่ปีกกาปิด
        res.status(400).json({
          message: 'กรุณากรอกข้อมูล quotationNumber มาให้ครบถ้วนครับ'
        });
        return; // ใส่ return เปล่าๆ เพื่อให้หยุดการทำงานในฟังก์ชันนี้พอ
      }

      const meta = await pdfService.generateAndSavePdf(quotationNumber, type);
      // เอา return ออก
      res.status(201).json({
        message: 'สร้างและบันทึกไฟล์ PDF เรียบร้อย',
        url: meta
      });
    } catch (error: any) {
      // เอา return ออก
      res.status(500).json({ message: error.message });
    }
  }

  //   async viewPdf(req: Request, res: Response) {
  //     try {
  //       const { id } = req.params;
  //       const filePath = await pdfService.getPdfPath(id);

  //       // เอา return ออก
  //       res.sendFile(filePath);
  //     } catch (error: any) {
  //       // เอา return ออก
  //       res.status(404).json({ message: error.message });
  //     }
  //   }
}
