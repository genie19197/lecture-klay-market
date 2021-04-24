import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faWallet, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Alert, Button, Container, Nav, Card, Row, Col, Modal, Form } from "react-bootstrap";
import QRCode from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./market.css";
import * as Caver from "./api/UseCaver";
import * as Klip from "./api/UseKlip";
import { MARKET_CONTRACT_ADDRESS } from "./constants";

const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";
function App() {
  const [nfts, setNfts] = useState([]); // {uri, id}
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState("0x0000000000000000000000000000000000000000");
  // UI
  const [qrvalue, setQrvalue] = useState("DEFAULT");
  const [tab, setTab] = useState("MARKET");
  const [mintImageUrl, setMintImageUrl] = useState("");
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "MODAL",
    onConfirm: () => {},
  });
  // To Construct Galary UI
  const rows = nfts.slice(nfts.length / 2);
  //
  const getUserData = () => {
    Klip.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await Caver.getBalance(address);
      setMyBalance(_balance);
    });
  };
  const fetchMarketNFTs = async () => {
    const _nfts = await Caver.fetchCardsOf(MARKET_CONTRACT_ADDRESS);
    setNfts(_nfts);
  };
  const fetchMyNFTs = async () => {
    if (myAddress === DEFAULT_ADDRESS) return;
    const _nfts = await Caver.fetchCardsOf(myAddress);
    setNfts(_nfts);
  };
  const onClickMint = async (_uri) => {
    if (myAddress === DEFAULT_ADDRESS) return;
    Klip.mintCardWithURI(myAddress, parseInt(Math.random() * 1000000), _uri, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    });
  };
  const onClickMyCard = async (tokenID) => {
    Klip.listingCard(myAddress, tokenID, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    });
  };
  const onClickMarketCard = async (tokenID) => {
    Klip.buyCard(tokenID, setQrvalue, (result) => {
      alert(JSON.stringify(result));
    });
  };
  const onClickCard = (tokenID) => {
    if (tab === "MARKET") {
      setModalProps({ title: "NFT를 구매하시겠어요?", onConfirm: () => onClickMarketCard(tokenID) });
      setShowModal(true);
    } else {
      setModalProps({ title: "NFT를 마켓에 올리시겠어요?", onConfirm: () => onClickMyCard(tokenID) });
      setShowModal(true);
    }
  };
  useEffect(() => {
    // Initialize Market
    getUserData();
    fetchMarketNFTs();
    // Get Market's cards
    // mintCardWithURI(addr, "104", "cool", privatekey);
  }, []);
  return (
    <div className="App">
      <div style={{ backgroundColor: "black", padding: 10 }}>
        <div style={{ fontSize: 30, fontWeight: "bold", paddingLeft: 5, marginTop: 10 }}>내 지갑</div>
        {myAddress}
        <br />
        <Alert onClick={getUserData} variant={"balance"} style={{ backgroundColor: "#f40075", fontSize: 30 }}>
          {myBalance} KLAY
        </Alert>
        <div style={{ color: "#EEEEEE", fontSize: 25, fontWeight: "bold", paddingLeft: 5, marginTop: 10 }}>전체</div>
        {qrvalue !== "DEFAULT" ? (
          <Container style={{ backgroundColor: "white", width: 300, height: 300, padding: 20 }}>
            <QRCode value={qrvalue} size={256} style={{ margin: "auto" }} />
          </Container>
        ) : null}

        {tab === "MARKET" || tab === "WALLET" ? (
          <div className="container" style={{ padding: 0, width: "100%" }}>
            {rows.map((o, rowIndex) => (
              <Row>
                <Col style={{ marginRight: 0, paddingRight: 0 }}>
                  <Card
                    onClick={() => {
                      onClickCard(nfts[rowIndex * 2].id);
                    }}
                  >
                    <Card.Img src={nfts[rowIndex * 2].uri} />
                  </Card>
                </Col>
                <Col>
                  {nfts.length > rowIndex * 2 + 1 ? (
                    <Card
                      onClick={() => {
                        onClickCard(nfts[rowIndex * 2 + 1].id);
                      }}
                    >
                      <Card.Img src={nfts[rowIndex * 2 + 1].uri} />
                    </Card>
                  ) : null}
                </Col>
              </Row>
            ))}
            <br />
            <br />
            <br />
          </div>
        ) : null}

        {/* MINT */}
        {tab === "MINT" ? (
          <div className="container" style={{ padding: 0, width: "100%" }}>
            <Card className="text-center" style={{ color: "black", height: "50%" }}>
              <Card.Header as="h5">NEW CARD</Card.Header>
              <Card.Body>
                {mintImageUrl !== "" ? <Card.Img src={mintImageUrl} height={"50%"} /> : null}
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Control
                      value={mintImageUrl}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setMintImageUrl(e.target.value);
                      }}
                      type="text"
                      placeholder="이미지 주소를 입력해주세요"
                    />
                    <Form.Text className="text-muted">블록체인에 발행됩니다.</Form.Text>
                  </Form.Group>
                  <Button
                    onClick={() => {
                      onClickMint(mintImageUrl);
                    }}
                    variant="primary"
                  >
                    발행하기
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        ) : null}

        <Modal
          centered
          size="sm"
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "black" }}>{modalProps.title}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
              }}
            >
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                modalProps.onConfirm();
                setShowModal(false);
              }}
            >
              진행
            </Button>
          </Modal.Footer>
        </Modal>
        <nav style={{ backgroundColor: "#BBBBBB", height: 45 }} className="navbar fixed-bottom navbar-light" role="navigation">
          <Nav className="w-100">
            <div className=" d-flex flex-row justify-content-around w-100">
              <div
                onClick={() => {
                  setTab("MARKET");
                  fetchMarketNFTs();
                }}
                className="row d-flex flex-column justify-content-center align-items-center"
              >
                <div>
                  <FontAwesomeIcon color="white" size="lg" icon={faHome} />
                </div>
              </div>
              <div
                onClick={() => {
                  setTab("MINT");
                }}
                className="row d-flex flex-column justify-content-center align-items-center"
              >
                <div>
                  <FontAwesomeIcon color="white" size="lg" icon={faPlus} />
                </div>
              </div>
              <div
                onClick={() => {
                  setTab("WALLET");
                  fetchMyNFTs();
                }}
                className="row d-flex flex-column justify-content-center align-items-center"
              >
                <div>
                  <FontAwesomeIcon color="white" size="lg" icon={faWallet} />
                </div>
              </div>
            </div>
          </Nav>
        </nav>
      </div>
    </div>
  );
}

export default App;
