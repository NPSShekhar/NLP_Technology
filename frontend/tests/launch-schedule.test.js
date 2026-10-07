import { test } from 'node:test';
import assert from 'node:assert/strict';
import { launchScheduleState } from '../src/lib/launch.js';
const launch = '2026-10-07T15:00:00+05:30';
const deadline = Date.parse(launch);
test('scheduled countdown uses one fixed deadline across reloads and timezones', () => {
  assert.deepEqual(launchScheduleState(launch, 10, deadline - 600001), { phase: 'soon', seconds: null });
  assert.deepEqual(launchScheduleState(launch, 10, deadline - 600000), { phase: 'countdown', seconds: 600 });
  assert.deepEqual(launchScheduleState(launch, 10, deadline - 123000), { phase: 'countdown', seconds: 123 });
  assert.deepEqual(launchScheduleState(launch, 10, deadline - 1), { phase: 'countdown', seconds: 1 });
  assert.deepEqual(launchScheduleState(launch, 10, deadline), { phase: 'ready', seconds: 1 });
  assert.deepEqual(launchScheduleState(launch, 10, deadline + 3600000), { phase: 'ready', seconds: 1 });
  assert.deepEqual(launchScheduleState('2026-10-07T09:30:00Z', 10, deadline - 123000), launchScheduleState(launch, 10, deadline - 123000));
});
test('missing or invalid configuration stays on Launching soon', () => {
  for (const value of ['', 'invalid', '2026-10-07T15:00:00']) assert.equal(launchScheduleState(value).phase, 'soon');
  assert.equal(launchScheduleState(launch, 5, deadline - 360000).phase, 'soon');
  assert.equal(launchScheduleState(launch, 'invalid', deadline - 600000).seconds, 600);
});
