import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    Alert,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import { Helmet } from "react-helmet";
import apiClient from "../Services/api";
import { countries } from "country-data";
import parse from "html-react-parser";
import {
    CalendarMonth,
    EmailOutlined,
    FmdGoodOutlined,
    PhoneOutlined,
    RateReviewOutlined,
    Reviews,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

const Contact = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
        phone: "",
        country_code: "+91",
        organization: "",
        file: null, // Initialize file to null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const location = useLocation();
    const fileInputRef = React.useRef(null);
    const [openDialog, setOpenDialog] = useState(false);

    const fullUrl = `${window.location.protocol}//${window.location.host}${location.pathname}`;

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleCall = (phoneNumber) => {
        window.location.href = `tel:${phoneNumber}`;
    };
    /*************** Mailing   ***************/

    const handleMailClick = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const handleFileChange = (event) => {
        setFormData({
            ...formData,
            file: event.target.files[0], // Get the first file
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await apiClient.get("/contact");
            setData(response.data);
        } catch (error) {
            setFormError("Error fetching contact data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const navigate = useNavigate();
    const handleClickholiday = () => {
        // Navigate to another page
        navigate("/holiday-list");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Start submitting
        const formPayload = new FormData();
        Object.keys(formData).forEach((key) => {
            formPayload.append(key, formData[key]);
        });

        try {
            await apiClient.post("/contact-form", formPayload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // setFormSuccess("Message and file sent successfully");
            setFormData({
                name: "",
                email: "",
                message: "",
                phone: "",
                country_code: "+91",
                organization: "",
                file: null,
            });
            handleDialogOpen(); // Open success dialog
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear file input
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join(", ")
                : "Error sending form";
            setFormError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <>
            <Helmet>
                <title>{data.page.seo_title}</title>
                <meta name="description" content={data.page.seo_description} />
                <meta name="keywords" content={data.page.seo_keywords} />

                <meta name="author" content="Rajesh Kumar" />
                <meta
                    name="publisher"
                    content="Brand Liaison India Pvt. Ltd."
                />
                <meta
                    name="copyright"
                    content="Brand Liaison India Pvt. Ltd."
                />
                <meta name="Classification" content="Business" />
                <meta name="coverage" content="Worldwide" />
                <meta name="distribution" content="Global" />
                <meta name="rating" content="General" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={data.page.seo_title} />
                <meta
                    property="og:description"
                    content={data.page.seo_description}
                />
                <meta property="og:url" content="https://bl-india.com" />
                <meta property="og:site_name" content="Brand Liaison India®" />
                <meta
                    property="og:image"
                    content="https://ik.imagekit.io/iouishbjd/BL-Site/logo-700x175.jpg?updatedAt=1722162753208"
                />
                <meta name="format-detection" content="telephone=no" />
                <link rel="canonical" href={fullUrl} />
            </Helmet>
            {/* Success Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Box
                        display="flex"
                        alignItems="center"
                        color="success.main"
                    >
                        <CheckCircleOutlineIcon sx={{ fontSize: 60, mr: 2 }} />
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your form has been submitted successfully!
                        <br />
                        <br />
                        We will get back to you soon.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDialogClose}
                        color="primary"
                        autoFocus
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Box padding={{ lg: 5, md: 4, sm: 3, xs: 2 }}>
                <Typography
                    className="page-main-heading page-heading"
                    variant="h1"
                    textAlign="center"
                    gutterBottom
                    marginBottom={5}
                >
                    Contact Us
                </Typography>

                <Grid
                    className="m-container contact-page"
                    container
                    spacing={{ xs: 1, md: 4 }}
                >
                    <Grid item xs={12} md={6}>
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Get in Touch
                            </Typography>
                            <List
                             
                            >
                                <ListItem sx={{ paddingLeft: 0 }}>
                              <Box sx={{display: 'flex', alignItems:'start'}}>
                                    <FmdGoodOutlined
                                        className="contact-icon"
                                        color="secondary"
                                    />
                                    <ListItemText
                                        primary="Address"
                                        secondary={parse(data.contact.address)}
                                    />
                                  </Box> 
                                </ListItem>
                                
                                <ListItem sx={{ paddingLeft: 0 }}>
                                    <Box
                                        sx={{
                                            paddingRight: 2,
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <EmailOutlined
                                            className="contact-icon"
                                            color="secondary"
                                        />
                                        <ListItemText
                                            sx={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleMailClick(
                                                    "info@bl-india.com"
                                                )
                                            }
                                            primary="Email"
                                            secondary={data.contact.email}
                                        />
                                    </Box>
                                </ListItem>
                                <ListItem sx={{ paddingLeft: 0 }}>
                                    <PhoneAndroidIcon
                                        aria-label="make a call"
                                        className="contact-icon"
                                        color="secondary"
                                    />
                                    <ListItemText
                                        primary="Mobile No"
                                        onClick={() =>
                                            handleCall(data.contact.phone1)
                                        }
                                        sx={{ cursor: "pointer" }}
                                        secondary={`${data.contact.phone1}, ${data.contact.phone2}`}
                                    />
                                </ListItem>

                                <ListItem sx={{ paddingLeft: 0 }}>
                                    <PhoneOutlined
                                       
                                        className="contact-icon"
                                        color="secondary"
                                        
                                    />
                                    <ListItemText  onClick={() =>
                                            handleCall(data.contact.phone3)
                                        }
                                        sx={{ cursor: "pointer" }}
                                        primary="Office No"
                                        secondary={data.contact.phone3}
                                    />
                                </ListItem>
                                <ListItem sx={{ paddingLeft: 0 }}>
                                    <RateReviewOutlined
                                        className="contact-icon"
                                        color="secondary"
                                    />
                                    <ListItemText
                                        onClick={() =>
                                            handleMailClick("rk@bl-india.com")
                                        }
                                        sx={{ cursor: "pointer" }}
                                        primary="Feedback / Grievance"
                                        secondary="rk@bl-india.com"
                                    />
                                </ListItem>
                            </List>
                            <Button
                                sx={{ mt: 2, cursor: "pointer" }}
                                variant="contained"
                                onClick={handleClickholiday}
                            >
                                <CalendarMonth />
                                &nbsp; Holiday List
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ marginTop: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Feel Free to Message
                            </Typography>
                            {formError && (
                                <Alert severity="error">{formError}</Alert>
                            )}
                            {formSuccess && (
                                <Alert severity="success">{formSuccess}</Alert>
                            )}
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={{ xs: 1 }}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TextField
                                                            select
                                                            name="country_code"
                                                            variant="standard"
                                                            value={
                                                                formData.country_code
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            sx={{
                                                                width: "auto",
                                                                minWidth:
                                                                    "80px",
                                                            }}
                                                        >
                                                            {countries.all.map(
                                                                (country) => (
                                                                    <MenuItem
                                                                        key={
                                                                            country.alpha2
                                                                        }
                                                                        value={
                                                                            country
                                                                                .countryCallingCodes[0]
                                                                        }
                                                                    >
                                                                        {
                                                                            country
                                                                                .countryCallingCodes[0]
                                                                        }{" "}
                                                                        (
                                                                        {
                                                                            country.name
                                                                        }
                                                                        )
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </TextField>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                          
                                            label="Organization"
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                         
                                            label="Message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                           
                                            type="file"
                                            onChange={handleFileChange}
                                            fullWidth
                                            margin="normal"
                                            helperText="If needed attach a PDF file. Other file types are not allowed."
                                            FormHelperTextProps={{
                                                style: {
                                                    color: "rgba(0, 0, 0, 0.54)",
                                                },
                                            }}
                                            inputRef={fileInputRef} // Attach the reference here
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            disabled={isSubmitting} // Disable button when submitting
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress size={24} />
                                            ) : (
                                                "Send Message"
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ marginTop: 1 }}>
                <iframe
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.772255150437!2d77.28261647620775!3d28.63658707566256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfca9ee9d65df%3A0x993a638ba380a2a8!2sBrand%20Liaison%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1719484146902!5m2!1sen!2sin"
                    style={{ border: 0, width: "100%", height: "410px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </Box>
        </>
    );
};

export default Contact;
