"""
Aurora Health – Streamlit UI (no Node.js required).
Run: streamlit run streamlit_app.py
"""
import streamlit as st

st.set_page_config(
    page_title="Aurora Health",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Sidebar navigation
st.sidebar.title("🏥 Aurora Health")
st.sidebar.markdown("---")
page = st.sidebar.radio(
    "Navigate",
    ["Dashboard", "Patient Search", "MPI Merge", "Scheduling", "Compliance & Audit"],
    label_visibility="collapsed",
)
st.sidebar.markdown("---")
st.sidebar.caption("No Node.js required • Python + Streamlit only")

# ----- Dashboard -----
if page == "Dashboard":
    st.title("Aurora Health Dashboard")
    st.markdown("Welcome back. Here's your system overview.")
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Active Patients", "12,847")
    with col2:
        st.metric("Appointments Today", "156")
    with col3:
        st.metric("Pending Merges", "23")
    with col4:
        st.metric("Audit Events (24h)", "1,249")
    st.subheader("Recent activity")
    st.info("Dashboard metrics and activity feed would appear here.")

# ----- Patient Search -----
elif page == "Patient Search":
    st.title("Patient Search")
    search = st.text_input("Search by name, ID, or MRN", placeholder="Enter search term...")
    if search:
        st.success(f"Searching for: **{search}**")
        st.dataframe(
            {
                "MRN": ["MRN001", "MRN002", "MRN003"],
                "Name": ["Sample Patient 1", "Sample Patient 2", "Sample Patient 3"],
                "DOB": ["1990-01-15", "1985-06-22", "1978-11-03"],
            },
            use_container_width=True,
            hide_index=True,
        )
    else:
        st.caption("Enter a search term to find patients.")

# ----- MPI Merge -----
elif page == "MPI Merge":
    st.title("MPI Merge")
    st.markdown("Review and merge duplicate patient records.")
    st.dataframe(
        {
            "Record A": ["John Doe (MRN-A1)", "Jane Smith (MRN-B2)"],
            "Record B": ["J. Doe (MRN-A2)", "J. Smith (MRN-B3)"],
            "Status": ["Pending", "Pending"],
        },
        use_container_width=True,
        hide_index=True,
    )
    if st.button("Merge selected"):
        st.success("Merge workflow would run here.")

# ----- Scheduling -----
elif page == "Scheduling":
    st.title("Scheduling")
    c1, c2 = st.columns(2)
    with c1:
        st.date_input("Date", label_visibility="collapsed")
    with c2:
        st.selectbox("Resource", ["Room 1", "Room 2", "Room 3"], label_visibility="collapsed")
    st.subheader("Appointments")
    st.dataframe(
        {
            "Time": ["09:00", "10:00", "11:00"],
            "Patient": ["Patient A", "Patient B", "Patient C"],
            "Type": ["Follow-up", "New", "Procedure"],
        },
        use_container_width=True,
        hide_index=True,
    )

# ----- Compliance & Audit -----
elif page == "Compliance & Audit":
    st.title("Compliance & Audit")
    st.markdown("View audit logs and compliance events.")
    st.dataframe(
        {
            "Timestamp": ["2025-02-26 10:00", "2025-02-26 09:45", "2025-02-26 09:30"],
            "Actor": ["user@example.com", "admin", "user@example.com"],
            "Action": ["VIEW_PATIENT", "MPI_MERGE", "LOGIN"],
            "Resource": ["Patient 123", "MRN-A1/MRN-A2", "—"],
        },
        use_container_width=True,
        hide_index=True,
    )
