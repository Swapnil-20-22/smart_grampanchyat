import requests
import sys
from datetime import datetime
import json

class SmartGramPanchayatTester:
    def __init__(self, base_url="https://village-admin-desk.preview.emergentagent.com"):
        self.base_url = base_url
        self.admin_token = None
        self.user_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, cookies=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers, cookies=cookies)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers, cookies=cookies)
            elif method == 'PATCH':
                response = self.session.patch(url, json=data, headers=test_headers, cookies=cookies)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}")

            return success, response

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_admin_login(self):
        """Test admin login and get cookies"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@grampanchayat.com", "password": "admin123"}
        )
        if success and response:
            # Store cookies for subsequent requests
            self.admin_cookies = response.cookies
            return True
        return False

    def test_user_registration(self):
        """Test user registration"""
        test_user_email = f"testuser_{datetime.now().strftime('%H%M%S')}@test.com"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "email": test_user_email,
                "password": "testpass123",
                "name": "Test User"
            }
        )
        if success and response:
            self.user_cookies = response.cookies
            self.test_user_email = test_user_email
            return True
        return False

    def test_user_login(self):
        """Test user login with test credentials"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={"email": "user@test.com", "password": "user123"}
        )
        if success and response:
            self.user_cookies = response.cookies
            return True
        return False

    def test_auth_me(self, cookies, user_type):
        """Test /auth/me endpoint"""
        success, response = self.run_test(
            f"Get Current User ({user_type})",
            "GET",
            "auth/me",
            200,
            cookies=cookies
        )
        return success

    def test_create_complaint(self, cookies):
        """Test complaint creation"""
        success, response = self.run_test(
            "Create Complaint",
            "POST",
            "complaints",
            200,
            data={
                "title": "Test Complaint",
                "description": "This is a test complaint for API testing"
            },
            cookies=cookies
        )
        if success and response:
            try:
                data = response.json()
                self.complaint_id = data.get('id')
                return True
            except:
                pass
        return False

    def test_get_complaints(self, cookies, user_type):
        """Test getting complaints"""
        success, response = self.run_test(
            f"Get Complaints ({user_type})",
            "GET",
            "complaints",
            200,
            cookies=cookies
        )
        return success

    def test_update_complaint_status(self, cookies):
        """Test updating complaint status (admin only)"""
        if not hasattr(self, 'complaint_id'):
            print("⚠️  Skipping complaint status update - no complaint ID available")
            return False
            
        success, response = self.run_test(
            "Update Complaint Status",
            "PATCH",
            f"complaints/{self.complaint_id}/status",
            200,
            data={"status": "In Progress"},
            cookies=cookies
        )
        return success

    def test_create_certificate(self, cookies):
        """Test certificate application"""
        success, response = self.run_test(
            "Create Certificate Application",
            "POST",
            "certificates",
            200,
            data={
                "certificate_type": "Birth Certificate",
                "details": "Birth certificate for testing purposes"
            },
            cookies=cookies
        )
        if success and response:
            try:
                data = response.json()
                self.certificate_id = data.get('id')
                return True
            except:
                pass
        return False

    def test_get_certificates(self, cookies, user_type):
        """Test getting certificates"""
        success, response = self.run_test(
            f"Get Certificates ({user_type})",
            "GET",
            "certificates",
            200,
            cookies=cookies
        )
        return success

    def test_update_certificate_status(self, cookies):
        """Test updating certificate status (admin only)"""
        if not hasattr(self, 'certificate_id'):
            print("⚠️  Skipping certificate status update - no certificate ID available")
            return False
            
        success, response = self.run_test(
            "Update Certificate Status",
            "PATCH",
            f"certificates/{self.certificate_id}/status",
            200,
            data={"status": "Approved"},
            cookies=cookies
        )
        return success

    def test_get_bills(self, cookies):
        """Test getting bills"""
        success, response = self.run_test(
            "Get Bills",
            "GET",
            "bills",
            200,
            cookies=cookies
        )
        return success

    def test_get_meetings(self, cookies):
        """Test getting meetings"""
        success, response = self.run_test(
            "Get Meetings",
            "GET",
            "meetings",
            200,
            cookies=cookies
        )
        return success

    def test_get_members(self, cookies):
        """Test getting panchayat members"""
        success, response = self.run_test(
            "Get Panchayat Members",
            "GET",
            "members",
            200,
            cookies=cookies
        )
        return success

    def test_get_notices(self, cookies):
        """Test getting notices"""
        success, response = self.run_test(
            "Get Notices",
            "GET",
            "notices",
            200,
            cookies=cookies
        )
        return success

    def test_logout(self, cookies):
        """Test logout"""
        success, response = self.run_test(
            "Logout",
            "POST",
            "auth/logout",
            200,
            cookies=cookies
        )
        return success

def main():
    print("🚀 Starting Smart Gram Panchayat API Tests")
    print("=" * 50)
    
    tester = SmartGramPanchayatTester()
    
    # Test admin authentication flow
    print("\n📋 ADMIN AUTHENTICATION TESTS")
    if not tester.test_admin_login():
        print("❌ Admin login failed, stopping admin tests")
        return 1
    
    if not tester.test_auth_me(tester.admin_cookies, "Admin"):
        print("❌ Admin auth/me failed")
    
    # Test user authentication flow
    print("\n📋 USER AUTHENTICATION TESTS")
    if not tester.test_user_registration():
        print("⚠️  User registration failed, trying existing user login")
        if not tester.test_user_login():
            print("❌ User login also failed, stopping user tests")
            return 1
    
    if not tester.test_auth_me(tester.user_cookies, "User"):
        print("❌ User auth/me failed")
    
    # Test complaint management
    print("\n📋 COMPLAINT MANAGEMENT TESTS")
    tester.test_create_complaint(tester.user_cookies)
    tester.test_get_complaints(tester.user_cookies, "User")
    tester.test_get_complaints(tester.admin_cookies, "Admin")
    tester.test_update_complaint_status(tester.admin_cookies)
    
    # Test certificate management
    print("\n📋 CERTIFICATE MANAGEMENT TESTS")
    tester.test_create_certificate(tester.user_cookies)
    tester.test_get_certificates(tester.user_cookies, "User")
    tester.test_get_certificates(tester.admin_cookies, "Admin")
    tester.test_update_certificate_status(tester.admin_cookies)
    
    # Test other endpoints
    print("\n📋 OTHER ENDPOINT TESTS")
    tester.test_get_bills(tester.user_cookies)
    tester.test_get_meetings(tester.user_cookies)
    tester.test_get_members(tester.user_cookies)
    tester.test_get_notices(tester.user_cookies)
    
    # Test logout
    print("\n📋 LOGOUT TESTS")
    tester.test_logout(tester.user_cookies)
    tester.test_logout(tester.admin_cookies)
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"Success rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("🎉 Backend API tests mostly successful!")
        return 0
    else:
        print("⚠️  Backend API tests have significant failures")
        return 1

if __name__ == "__main__":
    sys.exit(main())