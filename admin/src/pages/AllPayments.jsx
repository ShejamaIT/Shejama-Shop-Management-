import React, { useState, useEffect } from "react";
import {
    Container, Row, Nav, NavItem, NavLink, TabContent, TabPane
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
import Helmet from "../components/Helmet/Helmet";
import ReceivedCheques from "./Payments/ReceivedCheques";
// import ClearedCheques from "./Payments/ClearedCheques";
// import BouncedCheques from "./Payments/BouncedCheques";
// import CashToday from "./Payments/CashToday";
// import CashWeekly from "./Payments/CashWeekly";
// import CashMonthly from "./Payments/CashMonthly";
// import BankDeposits from "./Payments/BankDeposits";
// import BankWithdrawals from "./Payments/BankWithdrawals";
import BankDetails from "./Payments/BankDetails";
// import PaymentsPending from "./Payments/PaymentsPending";
// import PaymentsCompleted from "./Payments/PaymentsCompleted";
// import PaymentsOverdue from "./Payments/PaymentsOverdue";

const AllPayments = () => {
    const [activeTab, setActiveTab] = useState("cash-balance");
    const [subTabs, setSubTabs] = useState({
        "cash-balance": "today",
        "cheque-details": "received",
        "bank-details": "deposits",
        "customer-payments": "pending"
    });

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
        "customer-payments": "Customer Payments"
    };

    const subTabOptions = {
        "cash-balance": ["today", "weekly", "monthly"],
        "cheque-details": ["received", "cleared", "bounced"],
        "bank-details": ["deposits", "withdrawals","add&update"],
        "customer-payments": ["pending", "completed", "overdue"]
    };

    const subTabLabels = {
        "today": "Today",
        "weekly": "Weekly",
        "monthly": "Monthly",
        "received": "Received",
        "cleared": "Cleared",
        "bounced": "Bounced",
        "deposits": "Deposits",
        "withdrawals": "Withdrawals",
        "add&update" :" Add & Update",
        "pending": "Pending",
        "completed": "Completed",
        "overdue": "Overdue"
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

    const handleSubTabChange = (mainTab, subTab) => {
        setSubTabs((prev) => ({ ...prev, [mainTab]: subTab }));
    };

    const renderSubTabContent = (mainTab, subTab) => {
        if (mainTab === "cash-balance") {
            // if (subTab === "today") return <CashToday />;
            // if (subTab === "weekly") return <CashWeekly />;
            // if (subTab === "monthly") return <CashMonthly />;
        }
        if (mainTab === "cheque-details") {
            if (subTab === "received") return <ReceivedCheques />;
            // if (subTab === "cleared") return <ClearedCheques />;
            // if (subTab === "bounced") return <BouncedCheques />;
        }
        if (mainTab === "bank-details") {
            // if (subTab === "deposits") return <BankDeposits />;
            // if (subTab === "withdrawals") return <BankWithdrawals />;
             if (subTab === "add&update") return <BankDetails />;
        }
        if (mainTab === "customer-payments") {
            // if (subTab === "pending") return <PaymentsPending />;
            // if (subTab === "completed") return <PaymentsCompleted />;
            // if (subTab === "overdue") return <PaymentsOverdue />;
        }
        return <p>No content available.</p>;
    };

    return (
        <Helmet title="All Payments">
            <section>
                <Container className="dashboard">
                    <Nav tabs className="mb-3">
                        {tabNames.map((name) => (
                            <NavItem key={name}>
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

                    <TabContent activeTab={activeTab}>
                        {tabNames.map((name) => (
                            <TabPane tabId={name} key={name}>
                                <Nav tabs className="mb-3">
                                    {subTabOptions[name].map((sub) => (
                                        <NavItem key={sub}>
                                            <NavLink
                                                className={classnames({ active: subTabs[name] === sub })}
                                                onClick={() => handleSubTabChange(name, sub)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {subTabLabels[sub]}
                                            </NavLink>
                                        </NavItem>
                                    ))}
                                </Nav>

                                <Row>
                                    <div className="p-3 border rounded bg-light w-100">
                                        {renderSubTabContent(name, subTabs[name])}
                                    </div>
                                </Row>
                            </TabPane>
                        ))}
                    </TabContent>
                </Container>
            </section>
        </Helmet>
    );
};

export default AllPayments;
