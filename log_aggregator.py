#!/usr/bin/env python3
"""
Simple log aggregation script for coding interviews.

Supported input formats:
1. JSON lines:
   {"timestamp":"2026-06-10T12:00:01Z","service":"auth","level":"ERROR","message":"failed login"}
2. Key/value logs:
   timestamp=2026-06-10T12:00:01Z service=auth level=ERROR message="failed login"
3. Basic text logs:
   2026-06-10T12:00:01Z auth ERROR failed login

The script aggregates log counts by time bucket, service, and level.
"""

from __future__ import annotations

import argparse
import json
import re
import shlex
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


KV_PATTERN = re.compile(r"(\w+)=('([^']*)'|\"([^\"]*)\"|(\S+))")
LEVELS = {"DEBUG", "INFO", "WARN", "WARNING", "ERROR", "CRITICAL", "FATAL"}


@dataclass
class LogRecord:
    timestamp: datetime
    service: str
    level: str
    message: str


def parse_timestamp(value: str) -> datetime:
    value = value.strip()
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"

    try:
        parsed = datetime.fromisoformat(value)
    except ValueError as exc:
        raise ValueError(f"unsupported timestamp: {value}") from exc

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def truncate_timestamp(ts: datetime, bucket: str) -> str:
    if bucket == "minute":
        ts = ts.replace(second=0, microsecond=0)
    elif bucket == "hour":
        ts = ts.replace(minute=0, second=0, microsecond=0)
    elif bucket == "day":
        ts = ts.replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        raise ValueError(f"unsupported bucket: {bucket}")

    return ts.isoformat().replace("+00:00", "Z")


def parse_json_line(line: str) -> LogRecord | None:
    try:
        payload = json.loads(line)
    except json.JSONDecodeError:
        return None

    if not isinstance(payload, dict):
        return None

    timestamp = (
        payload.get("timestamp")
        or payload.get("time")
        or payload.get("ts")
    )
    service = payload.get("service") or payload.get("app") or payload.get("component")
    level = payload.get("level") or payload.get("severity")
    message = payload.get("message") or payload.get("msg") or ""

    if not timestamp or not service or not level:
        return None

    return LogRecord(
        timestamp=parse_timestamp(str(timestamp)),
        service=str(service),
        level=str(level).upper(),
        message=str(message),
    )


def parse_kv_line(line: str) -> LogRecord | None:
    matches = KV_PATTERN.findall(line)
    if not matches:
        return None

    values: dict[str, str] = {}
    for key, raw, single, double, bare in matches:
        values[key] = single or double or bare

    timestamp = values.get("timestamp") or values.get("time") or values.get("ts")
    service = values.get("service") or values.get("app") or values.get("component")
    level = values.get("level") or values.get("severity")
    message = values.get("message") or values.get("msg") or ""

    if not timestamp or not service or not level:
        return None

    return LogRecord(
        timestamp=parse_timestamp(timestamp),
        service=service,
        level=level.upper(),
        message=message,
    )


def parse_text_line(line: str) -> LogRecord | None:
    try:
        parts = shlex.split(line)
    except ValueError:
        return None

    if len(parts) < 4:
        return None

    timestamp, service, level = parts[0], parts[1], parts[2].upper()
    if level not in LEVELS:
        return None

    return LogRecord(
        timestamp=parse_timestamp(timestamp),
        service=service,
        level=level,
        message=" ".join(parts[3:]),
    )


def parse_line(line: str) -> LogRecord | None:
    line = line.strip()
    if not line:
        return None

    for parser in (parse_json_line, parse_kv_line, parse_text_line):
        record = parser(line)
        if record is not None:
            return record
    return None


def read_lines(path: str | None) -> Iterable[str]:
    if path:
        with Path(path).open("r", encoding="utf-8") as handle:
            yield from handle
    else:
        yield from sys.stdin


def aggregate_logs(lines: Iterable[str], bucket: str, top_n: int) -> dict:
    totals = Counter()
    bucket_counts: dict[str, Counter] = defaultdict(Counter)
    service_counts = Counter()
    level_counts = Counter()
    message_counts = Counter()
    skipped = 0

    for raw_line in lines:
        try:
            record = parse_line(raw_line)
        except ValueError:
            skipped += 1
            continue

        if record is None:
            skipped += 1
            continue

        bucket_key = truncate_timestamp(record.timestamp, bucket)
        dimension_key = f"{record.service}|{record.level}"

        totals["processed_lines"] += 1
        bucket_counts[bucket_key][dimension_key] += 1
        service_counts[record.service] += 1
        level_counts[record.level] += 1

        if record.message:
            message_counts[record.message] += 1

    return {
        "summary": {
            "processed_lines": totals["processed_lines"],
            "skipped_lines": skipped,
        },
        "by_service": dict(service_counts.most_common()),
        "by_level": dict(level_counts.most_common()),
        "top_messages": [
            {"message": message, "count": count}
            for message, count in message_counts.most_common(top_n)
        ],
        "time_buckets": {
            bucket_key: [
                {
                    "service": key.split("|", 1)[0],
                    "level": key.split("|", 1)[1],
                    "count": count,
                }
                for key, count in sorted(counter.items())
            ]
            for bucket_key, counter in sorted(bucket_counts.items())
        },
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Aggregate structured log files.")
    parser.add_argument(
        "input",
        nargs="?",
        help="Path to a log file. If omitted, stdin is used.",
    )
    parser.add_argument(
        "--bucket",
        choices=("minute", "hour", "day"),
        default="minute",
        help="Time bucket granularity.",
    )
    parser.add_argument(
        "--top",
        type=int,
        default=5,
        help="Number of top messages to return.",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty-print JSON output.",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()
    result = aggregate_logs(read_lines(args.input), bucket=args.bucket, top_n=args.top)

    if args.pretty:
        print(json.dumps(result, indent=2))
    else:
        print(json.dumps(result))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
