import { useQuery } from "@tanstack/react-query";
import type { Trace, Span } from "@shared/schema";

export interface TraceWithSpans {
  trace: Trace;
  spans: Span[];
}

export function useTraces() {
  return useQuery<Trace[]>({
    queryKey: ["/api/traces"],
  });
}

export function useTrace(traceId: string) {
  return useQuery<TraceWithSpans>({
    queryKey: ["/api/traces", traceId],
    enabled: !!traceId,
  });
}
