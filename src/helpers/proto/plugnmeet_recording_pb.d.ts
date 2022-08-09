// @generated by protoc-gen-es v0.0.10 with parameter "target=js+dts"
// @generated from file plugnmeet_recording.proto (package plugnmeet, syntax proto3)
/* eslint-disable */
/* @ts-nocheck */

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from '@bufbuild/protobuf';
import { Message, proto3 } from '@bufbuild/protobuf';
import type { RecordingTasks } from './plugnmeet_recorder_pb.js';

/**
 * @generated from message plugnmeet.RecordingReq
 */
export declare class RecordingReq extends Message<RecordingReq> {
  /**
   * @generated from field: plugnmeet.RecordingTasks task = 1;
   */
  task: RecordingTasks;

  /**
   * @generated from field: string sid = 2;
   */
  sid: string;

  /**
   * @generated from field: optional string rtmp_url = 3;
   */
  rtmpUrl?: string;

  /**
   * @generated from field: optional string custom_design = 4;
   */
  customDesign?: string;

  constructor(data?: PartialMessage<RecordingReq>);

  static readonly runtime: typeof proto3;
  static readonly typeName = 'plugnmeet.RecordingReq';
  static readonly fields: FieldList;

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): RecordingReq;

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): RecordingReq;

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): RecordingReq;

  static equals(
    a: RecordingReq | PlainMessage<RecordingReq> | undefined,
    b: RecordingReq | PlainMessage<RecordingReq> | undefined,
  ): boolean;
}
