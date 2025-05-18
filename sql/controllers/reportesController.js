const StockModel = require('../models/donacionesEspecieModel'); // Asegúrate de que el método esté en ese modelo
const ExcelJS = require('exceljs');

class ReportesController {
  static async exportarStockExcel(req, res) {
    try {
      const data = await StockModel.getStockPorArticulo();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Stock por Artículo');

      // Definir columnas
      worksheet.columns = [
        { header: 'ID Artículo', key: 'id_articulo' },
        { header: 'Nombre', key: 'nombre_articulo' },
        { header: 'Descripción', key: 'descripcion' },
        { header: 'Unidad', key: 'nombre_unidad' },
        { header: 'Medida', key: 'medida_abreviada' },
        { header: 'Total Restante', key: 'total_restante' }
      ];

      // Estilo de encabezados
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1E90FF' } // Azul
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Agregar datos y aplicar bordes
      data.forEach((item, index) => {
        const row = worksheet.addRow(item);
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // Ajustar ancho automáticamente
      worksheet.columns.forEach((column) => {
        let maxLength = 10;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 0;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength + 2;
      });

      // Filtro en la primera fila
      worksheet.autoFilter = {
        from: {
            row: 1,
            column: 1
        },
        to: {
            row: 1,
            column: worksheet.columns.length
        }
      };

      // Enviar el archivo
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=stock_por_articulo.xlsx'
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exportando Excel:', error);
      res.status(500).json({ error: 'Error al generar el archivo Excel' });
    }
  }
}

module.exports = ReportesController;
