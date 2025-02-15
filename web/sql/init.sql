CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE dhb_user
(
    user_id       uuid         not null PRIMARY KEY DEFAULT uuid_generate_v4(),
    alias         varchar(18)  not null,
    created_at    timestamptz  not null             DEFAULT CURRENT_TIMESTAMP,
    auth_provider varchar(25)  not null,
    auth_id       varchar(100) not null
);

CREATE UNIQUE INDEX dhb_user_auth_index ON dhb_user (auth_id, auth_provider);

CREATE TABLE board
(
    board_id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY
);

CREATE TABLE hang
(
    hang_id     int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id     uuid         not null REFERENCES dhb_user (user_id) ON DELETE RESTRICT,
    board_id    int          not null REFERENCES board (board_id) ON DELETE RESTRICT,
    created_at  timestamptz  not null DEFAULT CURRENT_TIMESTAMP,
    calibration varchar(100) not null -- todo: length
--     maxWeight
);

CREATE TABLE hang_moment
(
    hang_moment_id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    hang_id        int         not null REFERENCES hang (hang_id) ON DELETE RESTRICT,
    timestamp      timestamptz not null,
    weight_pounds  real        not null,
    scale0         int         not null,
    scale1         int         not null,
    scale2         int         not null,
    scale3         int         not null
);
