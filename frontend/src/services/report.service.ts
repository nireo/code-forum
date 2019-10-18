import BaseHttpService from "./base-service";

export default class ReportService extends BaseHttpService {
  private reportServiceUrl: string = "/api/user";

  async getReports() {
    return this.get(this.reportServiceUrl);
  }

  async deleteReport(id: string) {
    return this.delete(`${this.reportServiceUrl}/${id}`);
  }

  async updateReport(id: string, content: object) {
    return this.put(`${this.reportServiceUrl}/${id}`, content);
  }

  async createReport(id: string, content: object) {
    return this.post(`${this.reportServiceUrl}/${id}`, content);
  }
}
