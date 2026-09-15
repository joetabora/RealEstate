-- Phase 12: content validation gate audit trail.
CREATE TABLE "ContentGateEvent" (
    "id" TEXT NOT NULL,
    "targetKind" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "gate" TEXT NOT NULL,
    "fromLifecycle" TEXT NOT NULL,
    "toLifecycle" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "reasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentGateEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContentGateEvent_targetKind_targetId_createdAt_idx" ON "ContentGateEvent"("targetKind", "targetId", "createdAt");
CREATE INDEX "ContentGateEvent_gate_createdAt_idx" ON "ContentGateEvent"("gate", "createdAt");
