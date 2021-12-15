---
title: case-when使用方式
categories:
  - mysql
tags:
  - sql
date: 2021-12-15 19:03:20
urlname: case-when使用方式
---

> 梦在前方，路在脚下！

```sql
SELECT CODE,CASE
		WHEN use_status = "0" THEN
		"未占用" 
		WHEN use_status = "1" THEN
		"待入区" 
		WHEN use_status = "2" THEN
		"占用中" 
	END AS useStatus,
	target_code AS targetCode,
	lz_mode AS lzMode,
CASE
		WHEN lz_mode = "0" THEN "近身"
		when lz_mode = "1" THEN "非近身" 
	END AS lzModeTxt 
FROM
	( SELECT * FROM base_fictitious_rooms WHERE base_fictitious_rooms.type = 2 ) AS base_fictitious_rooms
	LEFT JOIN ( SELECT * FROM rel_target_room WHERE rel_target_room.state_review IS NULL ) rel_target_room ON base_fictitious_rooms.id = rel_target_room.room_id
	LEFT JOIN ( SELECT * FROM cas_targets WHERE cas_targets.state_review IS NULL ) AS cas_targets ON rel_target_room.target_id = cas_targets.id 
ORDER BY
	`code`
```

