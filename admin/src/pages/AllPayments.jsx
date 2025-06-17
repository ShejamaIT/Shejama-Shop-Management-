import React, { useState, useEffect } from "react";
import {Container, Row, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
import Helmet from "../components/Helmet/Helmet";

const AllPayments = () => {
    const [activeTab, setActiveTab] = useState("cash-balance");
    const location = useLocation();
    const navigate = useNavigate();

    const tabNames = [
        "cash-balance",
        "cheque-details",
        "bank-details",
        "customer-payments",
    ];

    const tabLabels = {
        "cash-balance": "Cash Balance",
        "cheque-details": "Cheque Details",
        "bank-details": "Bank Details",
        "customer-payments" : "Customer Payments"
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get("tab");
        if (tab && tabNames.includes(tab)) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        navigate(`?tab=${tabName}`);
    };

    return (
        <Helmet title={"Graphs"}>
            <section>
                <Container className="dashboard">
                    {/* Nav Tabs */}
                    <Nav tabs className="mb-3">
                        {tabNames.map((name, index) => (
                            <NavItem key={index}>
                                <NavLink
                                    className={classnames({ active: activeTab === name })}
                                    onClick={() => handleTabChange(name)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {tabLabels[name]}
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>

                    {/* Tab Content */}
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="cash-balance">
                            <Row>
                            </Row>
                        </TabPane>

                        <TabPane tabId="cheque-details">
                            <Row>
                            </Row>
                        </TabPane>

                        <TabPane tabId="bank-details">
                            <Row>
                            </Row>
                        </TabPane>
                        <TabPane tabId="customer-payments">
                            <Row>
                            </Row>
                        </TabPane>
                    </TabContent>
                </Container>
            </section>
        </Helmet>
    );
};
export default AllPayments;
