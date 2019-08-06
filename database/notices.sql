-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: recycling
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notices` (
  `notice_index` int(11) NOT NULL AUTO_INCREMENT,
  `notice_title` varchar(1000) NOT NULL,
  `notice_date` datetime NOT NULL,
  `notice_content` varchar(10000) NOT NULL,
  `notice_type` varchar(500) NOT NULL,
  `notice_file` longblob,
  PRIMARY KEY (`notice_index`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (1,'2018년도 건설폐기물 실적보고 2차 재검증 요청 관련 기초지자체 확인 및 필수조치 사항 알림','2019-07-24 00:00:00','2018년도 건설폐기물 실적보고 2차 재검증 요청과 관련하여\n\n기초지자체에서 확인 및 필수조치 사항에 대한 내용을 \n\n첨부하여 드리니 업무에 참고하시기 바랍니다.','notice',NULL),(2,'환경을 위한 우리의 선택','2019-07-25 00:00:00','우리가 1년에 사용하는 \n1회용 컵은 260억 개입니다.\n\n한 개의 1회용 플라스틱 컵이 \n분해되는데 필요한 시간은 \n최소 500년이 걸린다고 하는데요. \n\n무심코 귀찮아서 버린 \n오늘의 쓰레기가 \n내일 다시 돌아올 수 있습니다.  \n\n한번 쓰고 버리는 1회용품처럼\n지구도 한 번 쓰고 버릴 수는 없겠죠?\n\n쓰레기는 줄이고 버릴 때는 제대로\n안에서는 머그컵 밖에서는 텀블러 \n\n자원순환을 위해 \n함께 동참해주세요!','news',NULL),(3,'수도권서부지역본부 8월 올바로시스템 사용자교육 안내','2019-07-25 00:00:00','수도권서부지역본부에서 올바로시스템 사용자 교육이 아래와 같이 진행될 예정이니 많은 참여 바랍니다. \n \n 2019년 8월 교육 일시 및 장소 안내 \n\n8. 7수요일 14시~15시30분 수도권서부지역본부 7층 회의실 \n대상 배출자 운반자 처리자 \n\n 교육 참석을 원하실 경우, 붙임의 신청서를 팩스로 제출해주시기 바랍니다. \n 팩스  05058227830 \n\n 별도의 준비물은 없으며, 교육 자료는 당일 배포합니다','education',NULL),(4,'[전북지사] 08월 올바로시스템 사용자 교육 안내','2019-08-01 00:00:00','한국환경공단 전북지사에서는 2019년 08월 올바로시스템 사용자 교육을 \n아래와 같이 실시하고자 하오니 많은 참석바랍니다.\n\n                             ---아       래---\n 1. 일시 : 2019.08.21(수)14:00~17:00\n   ※ 교육장 수용인원 초과 시 교육일정 변경 이루어질 수 있음\n 2. 장소 : 한국환경공단 전북지사 대회의실(4층)\n 3. 주소 : 전북 전주시 완샨구 서곡로 100\n 4. 대상 : 폐기물관리법 시행규칙 제60조에 따른 대상 업체 담당자\n 5. 교육관련 세부사항 : 붙임 참조\n\n교육참석 희망업체는 교육신청서를 작성하여 한국환경공단 전북지사 팩스로 신청\n - 신청방법 : 팩스)0505-822-7845\n교육비는 없으며 간단한 필기 도구만 지참하시면 됩니다.\n\n붙임의 교육수강 신청서를  작성하여 신청하여 주시기 바랍니다','education',NULL),(5,'제주지사 올바로시스템 상시교육 안내','2019-08-01 00:00:00','제주지사에서는 올바로시스템 배출,운반,처리업체 사용자 대상으로 교육을 실시하오니 첨부파일 참조하시고 교육신청서를 작성하여 팩스(064-721-5564)로 보내주시기 바랍니다. 담당 강신철,김유철 전화번호 725-8511, 725-6549','education',NULL),(6,'[충북지사]올바로시스템 8월 사용자 교육 안내','2019-08-05 00:00:00','한국환경공단 충북지사 8월 올바로시스템 사용자교육을 안내해드립니다. \n\n일 시 : 8월 20일(화요일), 1400~1600 \n\n대상자 : 운반자, 처리자 \n\n장 소 : 한국환경공단 충북지사 회의실 6층 \n\n주 소 : 청주시 청원구 공항로 150번길 73 KT빌딩 6층 \n\n신청방법 : 붙임의 신청서를 팩스(0505-822-7850)으로 제출해주시기바랍니다.','education',NULL),(7,'건설폐기물 처리업체 대상 원격계량 자동 송수신시스템 구축 시범사업 추가모집','2019-08-05 00:00:00','가. 사업내용 : 처리업체에서 전자코드로 자동인시고딜 인계서 정보에 계량시설에서 계측된 계량값을 자동으로 Allbaro 시스템에 전송하는 시스템 구축\n나. 모집대상 : 건설폐기물 중간처리업\n다. 모집기간 : 2019.08.05. ~ 모집 완료시까지\n궁금한 사항이 있는 경우, 032-590-5231, 5233, 5237, 5238 로 전화주시기 바랍니다.\n감사합니다.','notice',NULL);
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-05 22:26:54
