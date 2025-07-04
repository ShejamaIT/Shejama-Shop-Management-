import React, { useState, useEffect } from "react";
import { Container, Row, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
import Helmet from "../components/Helmet/Helmet";

import DeliveryNotes from "./DeliveryNotes";
import TableAllDeliveryNotes from "../components/tables/TableAllDeliveryNotes";
import AddDeliveryShedule from "./AddDeliveryShedule";
import AddHire from "./AddHire";
import TableBookedHires from "../components/tables/TableBookedHires";
import TableDoneHires from "../components/tables/TableDoneHires";


const AllDeliveryNotes = () => {
    const [activeTab, setActiveTab] = useState("Create Delivery Note"); // Default tab
    const [nestedActiveTab, setNestedActiveTab] = useState("1");
    const [refreshKey, setRefreshKey] = useState(0); // For forcing re-render
    const location = useLocation();
    const navigate = useNavigate();

    const tabNames = [
        "Create Delivery Note",
        "All Delivery Notes",
        "Hire",
        "Add Scheduled Dates",
    ];

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
        <Helmet title={'Delivery Notes'}>
            <section>
                <Container className="dashboard">
                    {/* Main Tabs */}
                    <Nav tabs className="mb-3">
                        {tabNames.map((label, index) => (
                            <NavItem key={index}>
                                <NavLink
                                    className={classnames({ active: activeTab === label })}
                                    onClick={() => handleTabChange(label)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {label}
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>

                    {/* Tab Content */}
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="Create Delivery Note">
                            <Row>
                                <DeliveryNotes />
                            </Row>
                        </TabPane>

                        <TabPane tabId="All Delivery Notes">
                            <Row>
                                <TableAllDeliveryNotes />
                            </Row>
                        </TabPane>
                        <TabPane tabId="Hire" key={refreshKey}>
                            <Nav tabs className="mb-3">
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: nestedActiveTab === "1" })}
                                        onClick={() => setNestedActiveTab("1")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Add New Hire
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: nestedActiveTab === "2" })}
                                        onClick={() => setNestedActiveTab("2")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        All Booked Hires
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: nestedActiveTab === "3" })}
                                        onClick={() => setNestedActiveTab("3")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        All Done Hires
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={nestedActiveTab}>
                                <TabPane tabId="1" key={refreshKey}>
                                    <Row>
                                        <AddHire />
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2" key={refreshKey}>
                                    <Row>
                                        <TableBookedHires />
                                    </Row>
                                </TabPane>
                                <TabPane tabId="3" key={refreshKey}>
                                    <Row>
                                        <TableDoneHires />
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </TabPane>

                        <TabPane tabId="Add Scheduled Dates">
                            <Row>
                                <AddDeliveryShedule />
                            </Row>
                        </TabPane>
                    </TabContent>
                </Container>
            </section>
        </Helmet>
    );
};

export default AllDeliveryNotes;
