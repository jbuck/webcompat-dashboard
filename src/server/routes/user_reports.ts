import * as path from "node:path";
import { Request, Response } from "express";
import type { Logger } from "winston";

import { endWithStatusAndBody, getParsedUrl } from "../helpers/http";
import { handleReport } from "../helpers/report";

export default async function handleUserReports(logger: Logger, req: Request, res: Response) {
  const childLogger = logger.child({ handler: "handleUserReports" });
  childLogger.verbose("Entered handler");

  const searchParams = getParsedUrl(req).searchParams;
  if (!(searchParams.has("from") && searchParams.has("to"))) {
    return endWithStatusAndBody(res, 400, "`from` and `to` query parameters required");
  }

  await handleReport(childLogger, req, res, path.join(__dirname, "..", "helpers", "user_reports_transform.ts"), {
    paramFrom: searchParams.get("from")!,
    paramTo: searchParams.get("to")!,
  });
}
