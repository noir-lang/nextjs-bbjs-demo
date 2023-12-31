export const main = {
    backend: "dummy-backend-bb.js",
    abi: {
        parameters: [
            {
                name: "verification_key",
                type: { kind: "array", length: 114, type: { kind: "field" } },
                visibility: "private",
            },
            {
                name: "proof",
                type: { kind: "array", length: 94, type: { kind: "field" } },
                visibility: "private",
            },
            {
                name: "public_inputs",
                type: { kind: "array", length: 1, type: { kind: "field" } },
                visibility: "private",
            },
            { name: "key_hash", type: { kind: "field" }, visibility: "private" },
            {
                name: "input_aggregation_object",
                type: { kind: "array", length: 16, type: { kind: "field" } },
                visibility: "private",
            },
            {
                name: "proof_b",
                type: { kind: "array", length: 94, type: { kind: "field" } },
                visibility: "private",
            },
        ],
        param_witnesses: {
            input_aggregation_object: [
                211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224,
                225, 226,
            ],
            key_hash: [210],
            proof: [
                115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128,
                129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
                143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156,
                157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170,
                171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184,
                185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198,
                199, 200, 201, 202, 203, 204, 205, 206, 207, 208,
            ],
            proof_b: [
                227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240,
                241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254,
                255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268,
                269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282,
                283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296,
                297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310,
                311, 312, 313, 314, 315, 316, 317, 318, 319, 320,
            ],
            public_inputs: [209],
            verification_key: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
                39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
                57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
                75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
                93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
                109, 110, 111, 112, 113, 114,
            ],
        },
        return_type: { kind: "array", length: 16, type: { kind: "field" } },
        return_witnesses: [
            337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351,
            352,
        ],
    },
    bytecode:
        "H4sIAAAAAAAA/+3WQ7PcWQDG4fOObTNj287YMxl7JmPbtm3Htm1bXyG2zefWzSaLLFK3KotUTtXT1auurnp//9NdSh4ppexWSm7hVm7jdu7gTu7ibu7hXu7jfh7gQR6iZtmwswWvkLXvt2QrtmYbtmU7tmcHdmQndmYXdq38zmV39mBP9mJv9mFf9mN/DuBADuJgDuFQqnEYh3MER3IUR3MMx3Icx3MCJ3ISJ3MKp3Iap3MGZ3IWZ3MO53Ie53MBF3IRF3MJ1bmUy7icK7iSq7iaa7iW67ieG7iRm7iZGtis2KzYrNis2KzYrNis2KzYrNis2KzYrNis2KzYrNTkYSr2f5THeJwneJKneJpneJbneJ4XeJGXeHntjhWf+Sqv8Tpv8CZv8Tbv8C7v8T4f8CEf8TGf8Cmf8Tlf8CVf8TXf8C3f8T0/8CM/8TO/8Cu/8Tt/8Cd/8Tf/8C//8T+1qE0d6lKP+jSgIY1oTBOa0ozmtKAlrWhNG9rSjvZ0oCOd6EwXutKN7vSgJ73oTR/60o/+DGAggxjMEIYyjOGMYCSjGM2YUvkMjWVcqfKJHqPH6DF6jB6jx+gxeoweo8foMXqMHqPH6DE1StXP5jth07oTxjOBiUxiMlOYyjSmM4OZzGI2c5jLPOazgIUsYjFLWMoylrOClaxidWU+8RINRUPRUDQUDUVD0VA0FA1FQ9FQNBQNRUOp+C3UUDQUDUVD0VA0FA1FQ9FQNBQNRUPRUDQUDaUaGoqGoqFoKBqKhqKhaCgaioaioWgoGoqGoqFoKBqKhqKhaCgaioaioWgoGoqGoqFoKBqKhqKhVC/r3AlVfaY36v+C9Z41mprLcKgIAAA=",
    proving_key: [],
    verification_key: [],
    gates: 505501,
};
